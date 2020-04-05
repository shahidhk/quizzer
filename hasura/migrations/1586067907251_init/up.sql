CREATE TABLE public.answers (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    quiz_id uuid NOT NULL,
    question_id uuid NOT NULL,
    option_id uuid NOT NULL
);
CREATE TABLE public.quiz (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    start_at timestamp with time zone NOT NULL,
    end_at timestamp with time zone NOT NULL,
    name text NOT NULL,
    num_qs integer NOT NULL,
    show_score boolean DEFAULT false NOT NULL
);
CREATE VIEW public.live_quiz AS
 SELECT quiz.id,
    quiz.created_at,
    quiz.start_at,
    quiz.end_at,
    quiz.name
   FROM public.quiz
  WHERE ((quiz.start_at <= now()) AND (quiz.end_at >= now()));
CREATE TABLE public.options (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    is_correct boolean DEFAULT false NOT NULL,
    question_id uuid NOT NULL
);
CREATE TABLE public.questions (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    quiz_id uuid NOT NULL
);
CREATE TABLE public.scores (
    quiz_id uuid NOT NULL,
    user_id text NOT NULL,
    score integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    max integer NOT NULL
);
CREATE TABLE public.session_questions (
    question_id uuid NOT NULL,
    user_id text NOT NULL,
    quiz_id uuid NOT NULL
);
CREATE TABLE public.sessions (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id text NOT NULL,
    quiz_id uuid NOT NULL
);
CREATE TABLE public.users (
    id text NOT NULL,
    mobile text,
    name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    class smallint,
    email text,
    school text,
    address text,
    CONSTRAINT class_one_to_ten CHECK (((class > 0) AND (class <= 10)))
);
CREATE FUNCTION public.calculate_score() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    option_is_correct bool;
    max_score int;
BEGIN
    SELECT num_qs INTO max_score from public.quiz WHERE id = NEW.quiz_id;
    SELECT is_correct INTO option_is_correct FROM public.options WHERE id = NEW.option_id;
    IF option_is_correct THEN
        INSERT INTO public.scores (quiz_id, user_id, score, max) VALUES
            (NEW.quiz_id, NEW.user_id, 0, max_score)
            ON CONFLICT DO NOTHING;
        UPDATE public.scores SET score = score + 1 WHERE quiz_id = NEW.quiz_id AND user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$;
CREATE FUNCTION public.populate_random_questions_for_session() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE qs_limit int;
BEGIN
   SELECT num_qs INTO qs_limit FROM public.quiz WHERE id = NEW.quiz_id;
   INSERT INTO public.session_questions (question_id, user_id, quiz_id)
   SELECT public.questions.id as question_id, NEW.user_id, NEW.quiz_id FROM public.questions
   WHERE public.questions.quiz_id = NEW.quiz_id
   ORDER BY RANDOM()
   LIMIT qs_limit;
   RETURN NEW;
END;
$$;
ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_user_id_quiz_id_question_id_option_id_key UNIQUE (user_id, quiz_id, question_id, option_id);
ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.quiz
    ADD CONSTRAINT quiz_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.scores
    ADD CONSTRAINT scores_pkey PRIMARY KEY (quiz_id, user_id);
ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (user_id, quiz_id);
ALTER TABLE ONLY public.session_questions
    ADD CONSTRAINT session_questions_pkey PRIMARY KEY (user_id, quiz_id, question_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
CREATE TRIGGER trigger_calculate_score BEFORE INSERT ON public.answers FOR EACH ROW EXECUTE FUNCTION public.calculate_score();
CREATE TRIGGER trigger_populate_random_questions_for_session BEFORE INSERT ON public.sessions FOR EACH ROW EXECUTE FUNCTION public.populate_random_questions_for_session();
ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_answered_by_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.options(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quiz(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quiz(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.scores
    ADD CONSTRAINT scores_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quiz(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.scores
    ADD CONSTRAINT scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.session_questions
    ADD CONSTRAINT session_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.session_questions
    ADD CONSTRAINT session_questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quiz(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.session_questions
    ADD CONSTRAINT session_questions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT session_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quiz(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT session_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
