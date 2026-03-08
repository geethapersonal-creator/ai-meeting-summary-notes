CREATE TABLE public.email_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_email TEXT NOT NULL,
  summary TEXT,
  suggested_response TEXT,
  response_tone TEXT DEFAULT 'professional',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access (no auth required for this app)
ALTER TABLE public.email_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert and read emails
CREATE POLICY "Allow public insert" ON public.email_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON public.email_history FOR SELECT USING (true);