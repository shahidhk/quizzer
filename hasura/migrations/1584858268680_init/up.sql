CREATE SCHEMA qberry;
CREATE TABLE qberry.answers (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    quiz_id uuid NOT NULL,
    question_id uuid NOT NULL,
    option_id uuid NOT NULL
);
CREATE TABLE qberry.quiz (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    start_at timestamp with time zone NOT NULL,
    end_at timestamp with time zone NOT NULL,
    name text NOT NULL
);
CREATE VIEW qberry.live_quiz AS
 SELECT quiz.id,
    quiz.created_at,
    quiz.start_at,
    quiz.end_at,
    quiz.name
   FROM qberry.quiz
  WHERE ((quiz.start_at <= now()) AND (quiz.end_at >= now()));
CREATE TABLE qberry.options (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    is_correct boolean DEFAULT false NOT NULL,
    question_id uuid NOT NULL
);
CREATE TABLE qberry.questions (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    quiz_id uuid NOT NULL
);
CREATE TABLE qberry.scores (
    quiz_id uuid NOT NULL,
    user_id text NOT NULL,
    score integer NOT NULL
);
CREATE TABLE qberry.session_questions (
    question_id uuid NOT NULL,
    user_id text NOT NULL,
    quiz_id uuid NOT NULL
);
CREATE TABLE qberry.sessions (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id text NOT NULL,
    quiz_id uuid NOT NULL
);
CREATE TABLE qberry.users (
    id text NOT NULL,
    mobile character varying,
    name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT mobile_number CHECK (((mobile)::text ~ '^(6|7|8|9)[0-9]{9}$'::text))
);
ALTER TABLE ONLY qberry.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY qberry.answers
    ADD CONSTRAINT answers_user_id_quiz_id_question_id_option_id_key UNIQUE (user_id, quiz_id, question_id, option_id);
ALTER TABLE ONLY qberry.options
    ADD CONSTRAINT options_pkey PRIMARY KEY (id);
ALTER TABLE ONLY qberry.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY qberry.quiz
    ADD CONSTRAINT quiz_pkey PRIMARY KEY (id);
ALTER TABLE ONLY qberry.scores
    ADD CONSTRAINT scores_pkey PRIMARY KEY (quiz_id, user_id);
ALTER TABLE ONLY qberry.sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (user_id, quiz_id);
ALTER TABLE ONLY qberry.session_questions
    ADD CONSTRAINT session_questions_pkey PRIMARY KEY (user_id, quiz_id, question_id);
ALTER TABLE ONLY qberry.users
    ADD CONSTRAINT users_mobile_key UNIQUE (mobile);
ALTER TABLE ONLY qberry.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY qberry.answers
    ADD CONSTRAINT answers_answered_by_fkey FOREIGN KEY (user_id) REFERENCES qberry.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY qberry.answers
    ADD CONSTRAINT answers_option_id_fkey FOREIGN KEY (option_id) REFERENCES qberry.options(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY qberry.answers
    ADD CONSTRAINT answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES qberry.questions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY qberry.answers
    ADD CONSTRAINT answers_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES qberry.quiz(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY qberry.options
    ADD CONSTRAINT options_question_id_fkey FOREIGN KEY (question_id) REFERENCES qberry.questions(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY qberry.questions
    ADD CONSTRAINT questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES qberry.quiz(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY qberry.scores
    ADD CONSTRAINT scores_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES qberry.quiz(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY qberry.scores
    ADD CONSTRAINT scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES qberry.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY qberry.session_questions
    ADD CONSTRAINT session_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES qberry.questions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY qberry.session_questions
    ADD CONSTRAINT session_questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES qberry.quiz(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY qberry.session_questions
    ADD CONSTRAINT session_questions_user_id_fkey FOREIGN KEY (user_id) REFERENCES qberry.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY qberry.sessions
    ADD CONSTRAINT session_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES qberry.quiz(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY qberry.sessions
    ADD CONSTRAINT session_user_id_fkey FOREIGN KEY (user_id) REFERENCES qberry.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

CREATE FUNCTION qberry.calculate_score() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    option_is_correct bool;
BEGIN
    SELECT is_correct INTO option_is_correct FROM qberry.options WHERE id = NEW.option_id;
    IF option_is_correct THEN
        INSERT INTO qberry.scores (quiz_id, user_id, score) VALUES
            (NEW.quiz_id, NEW.user_id, 0)
            ON CONFLICT DO NOTHING;
        UPDATE qberry.scores SET score = score + 1 WHERE quiz_id = NEW.quiz_id AND user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$;
CREATE FUNCTION qberry.populate_random_questions_for_session() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   INSERT INTO qberry.session_questions (question_id, user_id, quiz_id)
   SELECT qberry.questions.id as question_id, NEW.user_id, NEW.quiz_id FROM qberry.questions
   WHERE qberry.questions.quiz_id = NEW.quiz_id
   ORDER BY RANDOM()
   LIMIT 5;
   RETURN NEW;
END;
$$;
CREATE TRIGGER trigger_calculate_score BEFORE INSERT ON qberry.answers FOR EACH ROW EXECUTE PROCEDURE qberry.calculate_score();
CREATE TRIGGER trigger_populate_random_questions_for_session BEFORE INSERT ON qberry.sessions FOR EACH ROW EXECUTE PROCEDURE qberry.populate_random_questions_for_session();
