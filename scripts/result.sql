SELECT
        name
       ,class
       ,school
       ,address
       ,mobile
       ,email
    FROM
        qberry.scores JOIN qberry.users
            ON qberry.scores.user_id = qberry.users.id
    WHERE
        qberry.scores.score = 5
        AND qberry.scores.quiz_id = 'f403c3dc-71c9-44ee-b5cd-daa72cd43bf7'
        AND qberry.scores.user_id NOT IN (
            SELECT
                    id AS user_id
                FROM
                    qberry.ignore_users
        )
        AND CLASS >= 6
    ORDER BY
        random ()
    LIMIT 3
