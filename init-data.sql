CREATE TABLE public.ratings (
	id int NOT NULL GENERATED ALWAYS AS IDENTITY,
	url text NOT NULL,
	resource_type varchar(20) NOT NULL,
	tag varchar(20) NOT NULL,
	shows int NOT NULL,
	likes int NOT NULL,
	dislikes int NOT NULL,
	is_visible boolean NOT NULL,
	raw_tags text NOT NULL,
	created_at timestamp NOT NULL,
	updated_at timestamp NOT NULL,
	CONSTRAINT ratings_pk PRIMARY KEY (id)
);
