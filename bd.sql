--
-- PostgreSQL database dump
--

\restrict iGXChLoyAUHlpuO4lZBBXbNsTVTh8v7vCZNl4rV51VSlxYgj6Tvq6pqca0frlZD

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-10-07 18:25:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16405)
-- Name: inventario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventario (
    pk_inventario integer NOT NULL,
    nombre_producto character varying(40) NOT NULL,
    precio numeric(5,2) NOT NULL,
    estatus smallint
);


ALTER TABLE public.inventario OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16404)
-- Name: inventario_pk_inventario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventario_pk_inventario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventario_pk_inventario_seq OWNER TO postgres;

--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 223
-- Name: inventario_pk_inventario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventario_pk_inventario_seq OWNED BY public.inventario.pk_inventario;


--
-- TOC entry 222 (class 1259 OID 16395)
-- Name: permiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permiso (
    pk_permiso integer NOT NULL,
    nombre_permiso character varying(20) NOT NULL,
    modulo character varying(20) NOT NULL,
    estatus smallint
);


ALTER TABLE public.permiso OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16394)
-- Name: permiso_pk_permiso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permiso_pk_permiso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permiso_pk_permiso_seq OWNER TO postgres;

--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 221
-- Name: permiso_pk_permiso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permiso_pk_permiso_seq OWNED BY public.permiso.pk_permiso;


--
-- TOC entry 220 (class 1259 OID 16386)
-- Name: rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol (
    pk_rol integer NOT NULL,
    nombre_rol character varying(20) NOT NULL,
    estatus smallint
);


ALTER TABLE public.rol OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16487)
-- Name: rol_permiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol_permiso (
    pk_rol_permiso integer NOT NULL,
    fk_rol integer NOT NULL,
    fk_permiso integer NOT NULL
);


ALTER TABLE public.rol_permiso OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16486)
-- Name: rol_permiso_fk_permiso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rol_permiso_fk_permiso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rol_permiso_fk_permiso_seq OWNER TO postgres;

--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 230
-- Name: rol_permiso_fk_permiso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_permiso_fk_permiso_seq OWNED BY public.rol_permiso.fk_permiso;


--
-- TOC entry 229 (class 1259 OID 16485)
-- Name: rol_permiso_fk_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rol_permiso_fk_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rol_permiso_fk_rol_seq OWNER TO postgres;

--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 229
-- Name: rol_permiso_fk_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_permiso_fk_rol_seq OWNED BY public.rol_permiso.fk_rol;


--
-- TOC entry 228 (class 1259 OID 16484)
-- Name: rol_permiso_pk_rol_permiso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rol_permiso_pk_rol_permiso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rol_permiso_pk_rol_permiso_seq OWNER TO postgres;

--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 228
-- Name: rol_permiso_pk_rol_permiso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_permiso_pk_rol_permiso_seq OWNED BY public.rol_permiso.pk_rol_permiso;


--
-- TOC entry 219 (class 1259 OID 16385)
-- Name: rol_pk_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rol_pk_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rol_pk_rol_seq OWNER TO postgres;

--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 219
-- Name: rol_pk_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_pk_rol_seq OWNED BY public.rol.pk_rol;


--
-- TOC entry 227 (class 1259 OID 16467)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    pk_usuario integer NOT NULL,
    nombre_completo character varying(45) NOT NULL,
    nombre_usuario character varying(15) NOT NULL,
    contrasena character varying(20) NOT NULL,
    estatus smallint,
    fk_rol integer NOT NULL
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16466)
-- Name: usuario_fk_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_fk_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_fk_rol_seq OWNER TO postgres;

--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 226
-- Name: usuario_fk_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_fk_rol_seq OWNED BY public.usuario.fk_rol;


--
-- TOC entry 235 (class 1259 OID 16544)
-- Name: usuario_permiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_permiso (
    pk_usuario_permiso integer NOT NULL,
    fk_usuario integer NOT NULL,
    fk_permiso integer NOT NULL
);


ALTER TABLE public.usuario_permiso OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16543)
-- Name: usuario_permiso_fk_permiso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_permiso_fk_permiso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_permiso_fk_permiso_seq OWNER TO postgres;

--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 234
-- Name: usuario_permiso_fk_permiso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_permiso_fk_permiso_seq OWNED BY public.usuario_permiso.fk_permiso;


--
-- TOC entry 233 (class 1259 OID 16542)
-- Name: usuario_permiso_fk_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_permiso_fk_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_permiso_fk_usuario_seq OWNER TO postgres;

--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 233
-- Name: usuario_permiso_fk_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_permiso_fk_usuario_seq OWNED BY public.usuario_permiso.fk_usuario;


--
-- TOC entry 232 (class 1259 OID 16541)
-- Name: usuario_permiso_pk_usuario_permiso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_permiso_pk_usuario_permiso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_permiso_pk_usuario_permiso_seq OWNER TO postgres;

--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 232
-- Name: usuario_permiso_pk_usuario_permiso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_permiso_pk_usuario_permiso_seq OWNED BY public.usuario_permiso.pk_usuario_permiso;


--
-- TOC entry 225 (class 1259 OID 16465)
-- Name: usuario_pk_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_pk_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_pk_usuario_seq OWNER TO postgres;

--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 225
-- Name: usuario_pk_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_pk_usuario_seq OWNED BY public.usuario.pk_usuario;


--
-- TOC entry 4888 (class 2604 OID 16408)
-- Name: inventario pk_inventario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario ALTER COLUMN pk_inventario SET DEFAULT nextval('public.inventario_pk_inventario_seq'::regclass);


--
-- TOC entry 4887 (class 2604 OID 16398)
-- Name: permiso pk_permiso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso ALTER COLUMN pk_permiso SET DEFAULT nextval('public.permiso_pk_permiso_seq'::regclass);


--
-- TOC entry 4886 (class 2604 OID 16389)
-- Name: rol pk_rol; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol ALTER COLUMN pk_rol SET DEFAULT nextval('public.rol_pk_rol_seq'::regclass);


--
-- TOC entry 4891 (class 2604 OID 16490)
-- Name: rol_permiso pk_rol_permiso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permiso ALTER COLUMN pk_rol_permiso SET DEFAULT nextval('public.rol_permiso_pk_rol_permiso_seq'::regclass);


--
-- TOC entry 4892 (class 2604 OID 16491)
-- Name: rol_permiso fk_rol; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permiso ALTER COLUMN fk_rol SET DEFAULT nextval('public.rol_permiso_fk_rol_seq'::regclass);


--
-- TOC entry 4893 (class 2604 OID 16492)
-- Name: rol_permiso fk_permiso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permiso ALTER COLUMN fk_permiso SET DEFAULT nextval('public.rol_permiso_fk_permiso_seq'::regclass);


--
-- TOC entry 4889 (class 2604 OID 16470)
-- Name: usuario pk_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN pk_usuario SET DEFAULT nextval('public.usuario_pk_usuario_seq'::regclass);


--
-- TOC entry 4890 (class 2604 OID 16471)
-- Name: usuario fk_rol; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN fk_rol SET DEFAULT nextval('public.usuario_fk_rol_seq'::regclass);


--
-- TOC entry 4894 (class 2604 OID 16547)
-- Name: usuario_permiso pk_usuario_permiso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permiso ALTER COLUMN pk_usuario_permiso SET DEFAULT nextval('public.usuario_permiso_pk_usuario_permiso_seq'::regclass);


--
-- TOC entry 4895 (class 2604 OID 16548)
-- Name: usuario_permiso fk_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permiso ALTER COLUMN fk_usuario SET DEFAULT nextval('public.usuario_permiso_fk_usuario_seq'::regclass);


--
-- TOC entry 4896 (class 2604 OID 16549)
-- Name: usuario_permiso fk_permiso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permiso ALTER COLUMN fk_permiso SET DEFAULT nextval('public.usuario_permiso_fk_permiso_seq'::regclass);


--
-- TOC entry 5066 (class 0 OID 16405)
-- Dependencies: 224
-- Data for Name: inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventario (pk_inventario, nombre_producto, precio, estatus) FROM stdin;
\.


--
-- TOC entry 5064 (class 0 OID 16395)
-- Dependencies: 222
-- Data for Name: permiso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permiso (pk_permiso, nombre_permiso, modulo, estatus) FROM stdin;
\.


--
-- TOC entry 5062 (class 0 OID 16386)
-- Dependencies: 220
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol (pk_rol, nombre_rol, estatus) FROM stdin;
\.


--
-- TOC entry 5073 (class 0 OID 16487)
-- Dependencies: 231
-- Data for Name: rol_permiso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol_permiso (pk_rol_permiso, fk_rol, fk_permiso) FROM stdin;
\.


--
-- TOC entry 5069 (class 0 OID 16467)
-- Dependencies: 227
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (pk_usuario, nombre_completo, nombre_usuario, contrasena, estatus, fk_rol) FROM stdin;
\.


--
-- TOC entry 5077 (class 0 OID 16544)
-- Dependencies: 235
-- Data for Name: usuario_permiso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario_permiso (pk_usuario_permiso, fk_usuario, fk_permiso) FROM stdin;
\.


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 223
-- Name: inventario_pk_inventario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventario_pk_inventario_seq', 1, false);


--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 221
-- Name: permiso_pk_permiso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permiso_pk_permiso_seq', 1, false);


--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 230
-- Name: rol_permiso_fk_permiso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_permiso_fk_permiso_seq', 1, false);


--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 229
-- Name: rol_permiso_fk_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_permiso_fk_rol_seq', 1, false);


--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 228
-- Name: rol_permiso_pk_rol_permiso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_permiso_pk_rol_permiso_seq', 1, false);


--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 219
-- Name: rol_pk_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_pk_rol_seq', 1, false);


--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 226
-- Name: usuario_fk_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_fk_rol_seq', 1, false);


--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 234
-- Name: usuario_permiso_fk_permiso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_permiso_fk_permiso_seq', 1, false);


--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 233
-- Name: usuario_permiso_fk_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_permiso_fk_usuario_seq', 1, false);


--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 232
-- Name: usuario_permiso_pk_usuario_permiso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_permiso_pk_usuario_permiso_seq', 1, false);


--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 225
-- Name: usuario_pk_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_pk_usuario_seq', 1, false);


--
-- TOC entry 4902 (class 2606 OID 16413)
-- Name: inventario inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_pkey PRIMARY KEY (pk_inventario);


--
-- TOC entry 4900 (class 2606 OID 16403)
-- Name: permiso permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT permiso_pkey PRIMARY KEY (pk_permiso);


--
-- TOC entry 4906 (class 2606 OID 16497)
-- Name: rol_permiso rol_permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permiso
    ADD CONSTRAINT rol_permiso_pkey PRIMARY KEY (pk_rol_permiso);


--
-- TOC entry 4898 (class 2606 OID 16393)
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (pk_rol);


--
-- TOC entry 4908 (class 2606 OID 16554)
-- Name: usuario_permiso usuario_permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permiso
    ADD CONSTRAINT usuario_permiso_pkey PRIMARY KEY (pk_usuario_permiso);


--
-- TOC entry 4904 (class 2606 OID 16478)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (pk_usuario);


--
-- TOC entry 4910 (class 2606 OID 16503)
-- Name: rol_permiso fk_permiso; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permiso
    ADD CONSTRAINT fk_permiso FOREIGN KEY (fk_permiso) REFERENCES public.permiso(pk_permiso);


--
-- TOC entry 4912 (class 2606 OID 16560)
-- Name: usuario_permiso fk_permiso; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permiso
    ADD CONSTRAINT fk_permiso FOREIGN KEY (fk_permiso) REFERENCES public.permiso(pk_permiso);


--
-- TOC entry 4911 (class 2606 OID 16498)
-- Name: rol_permiso fk_rol; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permiso
    ADD CONSTRAINT fk_rol FOREIGN KEY (fk_rol) REFERENCES public.rol(pk_rol);


--
-- TOC entry 4909 (class 2606 OID 16479)
-- Name: usuario fk_rol; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT fk_rol FOREIGN KEY (fk_rol) REFERENCES public.rol(pk_rol);


--
-- TOC entry 4913 (class 2606 OID 16555)
-- Name: usuario_permiso fk_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permiso
    ADD CONSTRAINT fk_usuario FOREIGN KEY (fk_usuario) REFERENCES public.usuario(pk_usuario);


-- Completed on 2026-10-07 18:25:48

--
-- PostgreSQL database dump complete
--

\unrestrict iGXChLoyAUHlpuO4lZBBXbNsTVTh8v7vCZNl4rV51VSlxYgj6Tvq6pqca0frlZD

