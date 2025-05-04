CREATE TABLE public.ai_usage(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    feature text NOT NULL,
    cost_usd numeric(10, 4) NOT NULL,
    tokens integer,
    model text,
    metadata jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON public.ai_usage(user_id);

CREATE INDEX ON public.ai_usage(created_at);

