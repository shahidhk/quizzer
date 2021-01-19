CREATE TABLE public.qberry_answers (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id int NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    quiz_id uuid NOT NULL,
    question_id uuid NOT NULL,
    option_id uuid NOT NULL
);
CREATE TABLE public.qberry_quiz (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    start_at timestamp with time zone NOT NULL,
    end_at timestamp with time zone NOT NULL,
    name text NOT NULL,
    num_qs integer NOT NULL,
    show_score boolean DEFAULT false NOT NULL
);
CREATE VIEW public.qberry_live_quiz AS
 SELECT public.qberry_quiz.id,
    public.qberry_quiz.created_at,
    public.qberry_quiz.start_at,
    public.qberry_quiz.end_at,
    public.qberry_quiz.name
   FROM public.qberry_quiz
  WHERE ((public.qberry_quiz.start_at <= now()) AND (public.qberry_quiz.end_at >= now()));

CREATE TABLE public.qberry_options (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    is_correct boolean DEFAULT false NOT NULL,
    question_id uuid NOT NULL
);
CREATE TABLE public.qberry_questions (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    quiz_id uuid NOT NULL
);
CREATE TABLE public.qberry_scores (
    quiz_id uuid NOT NULL,
    user_id int NOT NULL,
    score integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    max integer NOT NULL
);
CREATE TABLE public.qberry_session_questions (
    question_id uuid NOT NULL,
    user_id int NOT NULL,
    quiz_id uuid NOT NULL
);
CREATE TABLE public.qberry_sessions (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id int NOT NULL,
    quiz_id uuid NOT NULL
);

CREATE FUNCTION public.qberry_calculate_score() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    option_is_correct bool;
    max_score int;
BEGIN
    SELECT num_qs INTO max_score from public.qberry_quiz WHERE id = NEW.quiz_id;
    SELECT is_correct INTO option_is_correct FROM public.qberry_options WHERE id = NEW.option_id;
    IF option_is_correct THEN
        INSERT INTO public.qberry_scores (quiz_id, user_id, score, max) VALUES
            (NEW.quiz_id, NEW.user_id, 0, max_score)
            ON CONFLICT DO NOTHING;
        UPDATE public.qberry_scores SET score = score + 1 WHERE quiz_id = NEW.quiz_id AND user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE FUNCTION public.qberry_populate_random_questions_for_session() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE qs_limit int;
BEGIN
   SELECT num_qs INTO qs_limit FROM public.qberry_quiz WHERE id = NEW.quiz_id;
   INSERT INTO public.qberry_session_questions (question_id, user_id, quiz_id)
   SELECT public.qberry_questions.id as question_id, NEW.user_id, NEW.quiz_id FROM public.qberry_questions
   WHERE public.qberry_questions.quiz_id = NEW.quiz_id
   ORDER BY RANDOM()
   LIMIT qs_limit;
   RETURN NEW;
END;
$$;

ALTER TABLE ONLY public.qberry_answers
    ADD CONSTRAINT qberry_answers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.qberry_answers
    ADD CONSTRAINT qberry_answers_user_id_quiz_id_question_id_option_id_key UNIQUE (user_id, quiz_id, question_id, option_id);
ALTER TABLE ONLY public.qberry_options
    ADD CONSTRAINT qberry_options_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.qberry_questions
    ADD CONSTRAINT qberry_questions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.qberry_quiz
    ADD CONSTRAINT qberry_quiz_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.qberry_scores
    ADD CONSTRAINT qberry_scores_pkey PRIMARY KEY (quiz_id, user_id);
ALTER TABLE ONLY public.qberry_sessions
    ADD CONSTRAINT qberry_session_pkey PRIMARY KEY (user_id, quiz_id);
ALTER TABLE ONLY public.qberry_session_questions
    ADD CONSTRAINT qberry_session_questions_pkey PRIMARY KEY (user_id, quiz_id, question_id);

CREATE TRIGGER qberry_trigger_calculate_score BEFORE INSERT ON public.qberry_answers FOR EACH ROW EXECUTE FUNCTION public.qberry_calculate_score();
CREATE TRIGGER qberry_trigger_populate_random_questions_for_session BEFORE INSERT ON public.qberry_sessions FOR EACH ROW EXECUTE FUNCTION public.qberry_populate_random_questions_for_session();

ALTER TABLE ONLY public.qberry_answers
    ADD CONSTRAINT qberry_answers_answered_by_fkey FOREIGN KEY (user_id) REFERENCES public.auth_user(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.qberry_answers
    ADD CONSTRAINT qberry_answers_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.qberry_options(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.qberry_answers
    ADD CONSTRAINT qberry_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.qberry_questions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.qberry_answers
    ADD CONSTRAINT qberry_answers_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.qberry_quiz(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.qberry_options
    ADD CONSTRAINT qberry_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.qberry_questions(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.qberry_questions
    ADD CONSTRAINT qberry_questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.qberry_quiz(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.qberry_scores
    ADD CONSTRAINT qberry_scores_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.qberry_quiz(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.qberry_scores
    ADD CONSTRAINT qberry_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.auth_user(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.qberry_session_questions
    ADD CONSTRAINT qberry_session_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.qberry_questions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.qberry_session_questions
    ADD CONSTRAINT qberry_session_questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.qberry_quiz(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.qberry_session_questions
    ADD CONSTRAINT qberry_session_questions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.auth_user(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.qberry_sessions
    ADD CONSTRAINT qberry_session_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.qberry_quiz(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.qberry_sessions
    ADD CONSTRAINT qberry_session_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.auth_user(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
