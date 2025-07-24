
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseOperations } from '@/integrations/supabase/client-custom';
import { useForm, Controller, Control } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast as sonnerToast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

// No static Zod schema needed anymore, making it dynamic.

type SiteContent = {
  key: string;
  content: string;
};

// The form data will be a dynamic object based on fetched content.
type ContentFormData = Record<string, string>;

const AdminContentEditor: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: siteContent, isLoading, isError, error } = useQuery<SiteContent[], Error>({
    queryKey: ['site_content'],
    queryFn: async () => {
      const { data, error } = await supabaseOperations.getSiteContent();
      if (error) throw new Error(error.message);
      return data;
    },
  });

  // Transform the array of content into an object for the form.
  const initialFormData = React.useMemo(() => {
    if (!siteContent) return {};
    return siteContent.reduce((acc, item) => {
      acc[item.key] = item.content;
      return acc;
    }, {} as ContentFormData);
  }, [siteContent]);

  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting },
    reset,
  } = useForm<ContentFormData>({
    defaultValues: initialFormData,
  });

  React.useEffect(() => {
    // When the fetched data changes, reset the form with the new values.
    reset(initialFormData);
  }, [initialFormData, reset]);

  const mutation = useMutation({
    mutationFn: (newContent: ContentFormData) => {
      // Transform the form data back into an array of objects for the update operation.
      const updates = Object.entries(newContent).map(([key, content]) => ({
        key,
        content,
      }));
      return supabaseOperations.updateSiteContent(updates);
    },
    onSuccess: (data) => {
        if (data.error) {
            throw new Error(data.error.message);
        }
      sonnerToast.success('Conteúdo salvo com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['site_content'] });
    },
    onError: (error: Error) => {
      sonnerToast.error('Erro ao salvar conteúdo.', {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: ContentFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(7)].map((_, i) => (
            <div className="space-y-2" key={i}>
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Ocorreu um Erro</AlertTitle>
          <AlertDescription>
            Não foi possível carregar o conteúdo para edição: {error?.message}
          </AlertDescription>
        </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editor de Conteúdo do Site</CardTitle>
        <CardDescription>
          Altere os textos do site aqui. As alterações serão refletidas publicamente.
          Para adicionar um novo campo, basta inseri-lo na tabela 'site_content' do Supabase.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dynamically generate form fields from the fetched site content */}
          {siteContent && siteContent.map(({ key, content }) => (
            <Field
              key={key}
              control={control}
              name={key}
              label={key.replace(/_/g, ' ').replace(/\w/g, l => l.toUpperCase())} // Format key for display
              // Use textarea for longer content, input for shorter content
              component={content.length > 100 ? 'textarea' : 'input'}
            />
          ))}
          
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Helper component for form fields, now using a dynamic name
const Field = ({ control, name, label, component = 'input' }: { control: Control<ContentFormData>; name: string; label: string; component?: 'input' | 'textarea' }) => {
  const Component = component === 'input' ? Input : Textarea;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={name}>{label}</Label>
          <Component id={name} {...field} />
          {fieldState.error && <p className="text-sm text-red-600">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}

export default AdminContentEditor;
