
ALTER TABLE public.comments
ADD COLUMN gallery_item_id UUID;

-- Adicionar o índice para otimizar as consultas
CREATE INDEX idx_comments_gallery_item_id ON public.comments(gallery_item_id);

-- Adicionar a restrição de chave estrangeira
ALTER TABLE public.comments
ADD CONSTRAINT fk_gallery_item
FOREIGN KEY (gallery_item_id)
REFERENCES public.gallery_items(id)
ON DELETE SET NULL; -- ou ON DELETE CASCADE, se preferir
