USE [master]
GO
/****** Object:  Database [LaPalmaForWalkers]    Script Date: 07/09/2022 16:23:40 ******/
CREATE DATABASE [LaPalmaForWalkers]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'LaPalmaForWalkers', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\LaPalmaForWalkers.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'LaPalmaForWalkers_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\LaPalmaForWalkers_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [LaPalmaForWalkers] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [LaPalmaForWalkers].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [LaPalmaForWalkers] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET ARITHABORT OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [LaPalmaForWalkers] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [LaPalmaForWalkers] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET  DISABLE_BROKER 
GO
ALTER DATABASE [LaPalmaForWalkers] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [LaPalmaForWalkers] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [LaPalmaForWalkers] SET  MULTI_USER 
GO
ALTER DATABASE [LaPalmaForWalkers] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [LaPalmaForWalkers] SET DB_CHAINING OFF 
GO
ALTER DATABASE [LaPalmaForWalkers] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [LaPalmaForWalkers] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [LaPalmaForWalkers] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [LaPalmaForWalkers] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [LaPalmaForWalkers] SET QUERY_STORE = OFF
GO
USE [LaPalmaForWalkers]
GO
/****** Object:  Table [dbo].[route]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[route](
	[id] [nvarchar](50) NOT NULL,
	[variant_of] [nchar](10) NULL,
	[name] [nvarchar](100) NOT NULL,
	[length_km] [float] NULL,
	[walking_time] [time](7) NULL,
	[short_description] [nvarchar](100) NULL,
	[description] [nvarchar](450) NOT NULL,
	[route_file] [nvarchar](100) NULL,
	[refreshments] [nvarchar](200) NULL,
	[start] [nvarchar](50) NOT NULL,
	[finish] [nvarchar](50) NOT NULL,
	[directions] [nvarchar](100) NULL,
 CONSTRAINT [PK_Routes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[route_category]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[route_category](
	[id] [nvarchar](50) NOT NULL,
	[feature] [nvarchar](50) NOT NULL,
	[is_strong] [bit] NOT NULL,
	[notes] [nvarchar](100) NULL,
 CONSTRAINT [PK_route_category] PRIMARY KEY CLUSTERED 
(
	[id] ASC,
	[feature] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[category]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[category](
	[name] [nvarchar](50) NOT NULL,
	[type] [nvarchar](50) NOT NULL,
	[label] [nvarchar](50) NOT NULL,
	[filter_include_text] [nvarchar](50) NULL,
	[filter_exclude_text] [nvarchar](50) NULL,
	[description] [nvarchar](150) NULL,
	[strong] [nvarchar](50) NULL,
	[icon] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_category] PRIMARY KEY CLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[route_filters]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[route_filters] AS
SELECT
	rc.id AS Id,
	rc.feature AS Filter,
	C.type AS FeatureType
FROM
	route_category AS rc
JOIN
	category C ON C.name = RC.feature
JOIN
	route as r ON r.variant_of IS NULL
WHERE rc.id = r.id
GO
/****** Object:  View [dbo].[variant_filter]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[variant_filter] AS
SELECT
	R.variant_of AS RouteId,
	RC.feature AS Feature,
	C.type AS FeatureType,
	COUNT(RC.feature) AS FeatureCount
FROM
	route_category RC
JOIN
	route R ON R.id = RC.id
JOIN
	category C ON C.name = RC.feature
WHERE
	R.variant_of IS NOT NULL
GROUP BY
	R.variant_of, RC.feature, C.type
GO
/****** Object:  Table [dbo].[area]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[area](
	[area_name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_area] PRIMARY KEY CLUSTERED 
(
	[area_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[bus_route]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[bus_route](
	[route_number] [smallint] NOT NULL,
	[mins_between] [tinyint] NULL,
 CONSTRAINT [PK_Busroutes] PRIMARY KEY CLUSTERED 
(
	[route_number] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[bus_route_bus_stop]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[bus_route_bus_stop](
	[route_number] [smallint] NOT NULL,
	[stop_name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_BusrouteBusstops] PRIMARY KEY CLUSTERED 
(
	[route_number] ASC,
	[stop_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[bus_stop]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[bus_stop](
	[stop_name] [nvarchar](50) NOT NULL,
	[stop_type] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Busstops] PRIMARY KEY CLUSTERED 
(
	[stop_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[category_type]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[category_type](
	[category_type] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_category_type] PRIMARY KEY CLUSTERED 
(
	[category_type] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[danger]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[danger](
	[route_id] [nvarchar](50) NOT NULL,
	[danger] [nvarchar](50) NOT NULL,
	[description] [nvarchar](100) NOT NULL,
	[is_strong] [bit] NOT NULL,
 CONSTRAINT [PK_danger] PRIMARY KEY CLUSTERED 
(
	[route_id] ASC,
	[danger] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[image]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[image](
	[id] [nvarchar](50) NOT NULL,
	[is_thumbnail] [bit] NOT NULL,
	[pic_id] [nvarchar](50) NOT NULL,
	[width] [smallint] NOT NULL,
	[height] [smallint] NOT NULL,
	[caption] [nvarchar](100) NULL,
 CONSTRAINT [PK_Images_1] PRIMARY KEY CLUSTERED 
(
	[pic_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[location]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[location](
	[name] [nvarchar](50) NOT NULL,
	[latitude] [float] NOT NULL,
	[longitude] [float] NOT NULL,
	[parking] [nvarchar](150) NOT NULL,
	[bus_stop] [nvarchar](50) NULL,
	[bus_notes] [nvarchar](150) NULL,
	[notes] [nvarchar](150) NULL,
	[taxi] [nvarchar](150) NULL,
 CONSTRAINT [PK_Locations] PRIMARY KEY CLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[location_area]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[location_area](
	[area_name] [nvarchar](50) NOT NULL,
	[location] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Areas] PRIMARY KEY CLUSTERED 
(
	[area_name] ASC,
	[location] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[opening_time]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[opening_time](
	[poi_id] [nvarchar](50) NOT NULL,
	[time_period] [nvarchar](50) NOT NULL,
	[hours] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_opening_times] PRIMARY KEY CLUSTERED 
(
	[poi_id] ASC,
	[time_period] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[poi]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[poi](
	[id] [nvarchar](50) NOT NULL,
	[short_name] [nvarchar](50) NOT NULL,
	[full_name] [nvarchar](100) NOT NULL,
	[description] [nvarchar](150) NOT NULL,
	[entry_cost] [nvarchar](50) NULL,
	[tel] [nvarchar](50) NULL,
	[email] [nvarchar](50) NULL,
	[web_name] [nvarchar](50) NULL,
	[web_address] [nvarchar](150) NULL,
	[location] [nvarchar](50) NOT NULL,
	[location_description] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_poi] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[poi_image]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[poi_image](
	[id] [nvarchar](50) NOT NULL,
	[is_thumbnail] [bit] NOT NULL,
	[pic_id] [nvarchar](50) NOT NULL,
	[width] [smallint] NOT NULL,
	[height] [smallint] NOT NULL,
 CONSTRAINT [PK_poi_image_1] PRIMARY KEY CLUSTERED 
(
	[id] ASC,
	[is_thumbnail] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[poi_tag]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[poi_tag](
	[poi_id] [nvarchar](50) NOT NULL,
	[tag] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_poi_tag] PRIMARY KEY CLUSTERED 
(
	[poi_id] ASC,
	[tag] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[route_poi]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[route_poi](
	[route_id] [nvarchar](50) NOT NULL,
	[poi_id] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_route_poi] PRIMARY KEY CLUSTERED 
(
	[route_id] ASC,
	[poi_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[route_trail]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[route_trail](
	[route_id] [nvarchar](50) NOT NULL,
	[trail_id] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_RoutesTrails] PRIMARY KEY CLUSTERED 
(
	[route_id] ASC,
	[trail_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tag]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tag](
	[tag] [nvarchar](50) NOT NULL,
	[description] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Tags] PRIMARY KEY CLUSTERED 
(
	[tag] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[trail]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[trail](
	[trail_id] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Trails] PRIMARY KEY CLUSTERED 
(
	[trail_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[area] ([area_name]) VALUES (N'central')
INSERT [dbo].[area] ([area_name]) VALUES (N'east')
INSERT [dbo].[area] ([area_name]) VALUES (N'north')
INSERT [dbo].[area] ([area_name]) VALUES (N'south')
INSERT [dbo].[area] ([area_name]) VALUES (N'west')
GO
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (2, NULL)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (5, NULL)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (8, NULL)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (11, NULL)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (12, NULL)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (20, NULL)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (23, 120)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (24, 30)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (27, 60)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (33, 60)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (35, 30)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (100, 60)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (110, 60)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (120, 120)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (200, 120)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (201, 120)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (210, 120)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (300, 30)
INSERT [dbo].[bus_route] ([route_number], [mins_between]) VALUES (500, 30)
GO
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (2, N'Santa Cruz')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (5, N'Los Llanos')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (8, N'Los Llanos')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (11, N'Santa Cruz')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (12, N'Santa Cruz')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (20, N'Santa Cruz')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (23, N'Faro de Fuencaliente')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (23, N'Volcán San Antonio')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (24, N'Los Llanos')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (27, N'Los Llanos')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (27, N'Mirador El Time')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (33, N'Santa Cruz')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (33, N'Santuario de Las Nieves')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (35, N'Mirador Concepción')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (35, N'San Pedro')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (35, N'Santa Cruz')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (100, N'Barlovento')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (100, N'Cubo de la Galga')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (100, N'Los Sauces')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (100, N'Santa Cruz')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (110, N'El Jesús')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (110, N'El Pinar')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (110, N'El Roque')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (110, N'Fuente del Toro')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (110, N'Los Llanos')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (110, N'Mirador El Time')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (110, N'Puntagorda')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (110, N'Tijarafe')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (120, N'Barlovento')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (120, N'El Pinar')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (120, N'Franceses')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (120, N'La Zarza')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (120, N'Las Tricias')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (120, N'Llano Negro')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (120, N'Santo Domingo')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (200, N'Argual Abajo')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (200, N'Faro de Fuencaliente')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (200, N'Santa Cruz')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (201, N'El Molino')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (201, N'Faro de Fuencaliente')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (201, N'Santa Cruz')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (210, N'Faro de Fuencaliente')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (210, N'Jedy')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (210, N'San Nicolás')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (300, N'Centro de Visitantes')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (300, N'El Paso')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (300, N'Los Llanos')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (300, N'Santa Cruz')
INSERT [dbo].[bus_route_bus_stop] ([route_number], [stop_name]) VALUES (500, N'Santa Cruz')
GO
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Argual Abajo', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Barlovento', N'interchange')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Centro de Visitantes', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Cubo de la Galga', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'El Jesús', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'El Molino', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'El Paso', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'El Pinar', N'interchange')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'El Roque', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Faro de Fuencaliente', N'interchange')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Franceses', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Fuente del Toro', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Jedy', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'La Zarza', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Las Tricias', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Llano Negro', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Los Llanos', N'interchange')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Los Sauces', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Mirador Concepción', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Mirador El Time', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Puntagorda', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'San Nicolás', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'San Pedro', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Santa Cruz', N'interchange')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Santo Domingo', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Santuario de Las Nieves', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Tijarafe', N'stop')
INSERT [dbo].[bus_stop] ([stop_name], [stop_type]) VALUES (N'Volcán San Antonio', N'stop')
GO
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'accessBus', N'basics', N'Fully accessible by bus', N'Fully accessible by bus', NULL, NULL, NULL, N'bus.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'accessCar', N'basics', N'Fully accessible by car', N'Fully accessible by car', NULL, NULL, NULL, N'car.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'archeological', N'interest', N'Archeological', N'With historic interest', NULL, N'Passes sites of archeological interest, mostly petroglyphs.', N'Good examples', N'ancient.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'circular', N'walkType', N'Circular route', N'Circular walks', NULL, NULL, NULL, N'circular.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'coastal', N'terrain', N'Coastal path', N'Along coastal paths', N'Coastal paths', N'Usually along cliff tops, occasionally down to the sea, often with deep barrancos.', N'Spectacular', N'waves.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'danger', N'danger', N'Danger', NULL, N'Unusually risky', N'Risk of death or injury.', N'High risk', N'warning.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'dragon', N'terrain', N'Dragon trees', N'With dragon trees', N'Dragon tree routes', N'Passes through a dragon tree grove or past spectacular examples.', N'Good examples', N'dragontree.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'easy', N'effort', N'Easy', N'Easy walks', NULL, N'Gentle gradients or only short steep bits and not very long overall.', NULL, N'effort1.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'extreme', N'effort', N'Extreme', N'Extreme walks', NULL, N'Only achievable by extremely fit walkers. Most people will need to split such a walk into two or more stages.', NULL, N'effort5.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'favourite', N'basics', N'Favourite', N'Favourite', NULL, N'Saved as a favourite by the user.', NULL, N'heart-full-black.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'full', N'duration', N'Full day', N'Longer walks', NULL, N'Fairly tiring walk that includes extended steep passages and/or is quite long.', NULL, N'duration3.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'gps', N'warning', N'Unreliable GPS', NULL, N'Very unreliable GPS', N'The route passes through areas where the GPS signal may become weak or loat.', N'Very', N'signal.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'half', N'duration', N'Half day', N'Short walks', NULL, N'Reasonably fit walkers can fit a walk of this duration into half a day although combining two short day walks generally makes for a long day.', NULL, N'duration2.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'hard', N'effort', N'Hard', N'Very tiring walks', NULL, N'Long, with a fair amount of steep climbing. You may want a rest day after one of these.', NULL, N'effort4.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'laurisilva', N'terrain', N'Laurisilva forest', N'With laurisilva forest', N'Laurisilva forest', N'Passes through ancient laurel forest.', N'Good example', N'leaves.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'linear', N'walkType', N'Point-to-point route', N'Point-to-point walks', NULL, N'Requires a bus or taxi ride to complete the loop.', NULL, N'linear.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'long', N'duration', N'Long day', N'Very long walks', NULL, N'In winter these require an early start if you''re not to risk running out of daylight.', NULL, N'duration4.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'moderate', N'effort', N'Moderate', N'Moderate walks', NULL, N'Requires some effort with some climbing involved but not overly long or tiring.', NULL, N'effort2.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'mountain', N'terrain', N'Mountain walk', N'With mountains', N'Mountains', N'High altitude mountain path, rocky and exposed.', N'Remote', N'mountain.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'peaks', N'interest', N'Mountain peaks', N'With mountain peaks', NULL, N'Passes near or over mointain peaks.', N'Great', N'peak.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'pine', N'terrain', N'Pine forest', N'With pine forest', N'Pine forest routes', N'Passes through significant Canary Pine forest.', N'Good example', N'forest.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'poi', N'interest', N'Points of Interest', N'With places to visit', NULL, N'The walk passes:', N'Special', N'pin.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'port', N'interest', N'Port', N'With a port', NULL, N'Small harbour with fishing shacks or more substantial homes.', N'Special interest', N'anchor.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'refreshments', N'basics', N'Refreshments', N'With refreshments', NULL, N'Food and drink along the way.', NULL, N'refreshments.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'return', N'walkType', N'There-and-back route', N'There-and-back walks', NULL, NULL, NULL, N'return.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'riverbed', N'terrain', N'Riverbed', N'With river beds', N'River beds', N'Route follows part of the way along a dried-up riverbed.', N'Impressive', N'riverbed.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'rockfall', N'warning', N'Risk of rockfall', NULL, N'High risk of rockfall', N'Possibility of rockfall from overhanging rocks', N'High', N'rockfall.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'scenic', N'interest', N'Scenic', N'Particularly scenic', NULL, N'Contains particularly photogenic sections.', N'Spectacular', N'camera.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'slippery', N'warning', N'Risk of slipping', NULL, N'Very slippery paths', N'Occasional hazardous conditions underfoot.', N'High', N'slippery.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'starred', N'basics', N'Starred', N'Outstanding', NULL, N'A walk of outstanding quality, a classic.', NULL, N'star.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'steep', N'warning', N'Steep', NULL, N'Very steep paths', N'Steep sections, can be hard on the knees when descending.', N'Very', N'steep.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'strenuous', N'effort', N'Strenuous', N'Strenuous walks', NULL, N'A fairly tiring walk that includes extended steep passages and/or is quite long.', NULL, N'effort3.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'stroll', N'duration', N'Stroll', N'Strolls under 2h', NULL, N'A short walk usually under 2 hours duration.', NULL, N'duration1.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'urban', N'terrain', N'Urban', N'With urban areas', N'Urban areas', N'Goes through built-up areas.', N'Attractive', N'urban.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'vertigo', N'warning', N'Vertigo risk', NULL, N'High vertigo risk', N'Exposed peaks or paths near steep drops.', N'High', N'dizzy.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'views', N'interest', N'Viewpoints', N'With viewpoints', NULL, N'Dedicated viewing platforms (miradors) along the way.', N'Spectacular', N'viewpoint.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'volcanic', N'terrain', N'Volcanic', N'With volcanic interest', N'No volcanic routes', N'Passes over notable volcanic terrain: lava flows, picon or volcanic peaks.', N'Spectacular', N'volcano.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'walkLocations', N'walkLocations', N'Locations', N'Specified locations', N'Specified locations', N'Areas', NULL, N'location.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'waymarked', N'basics', N'Waymarked', N'On waymarked trails', NULL, N'The route stays entirely on waymarked trails.', NULL, N'signpost.svg')
INSERT [dbo].[category] ([name], [type], [label], [filter_include_text], [filter_exclude_text], [description], [strong], [icon]) VALUES (N'weather', N'warning', N'Weather dependent', NULL, N'Needs good weather', N'Requires favourable weather conditions: check the forecasts.', N'Highly', N'weather.svg')
GO
INSERT [dbo].[category_type] ([category_type]) VALUES (N'basics')
INSERT [dbo].[category_type] ([category_type]) VALUES (N'danger')
INSERT [dbo].[category_type] ([category_type]) VALUES (N'duration')
INSERT [dbo].[category_type] ([category_type]) VALUES (N'effort')
INSERT [dbo].[category_type] ([category_type]) VALUES (N'interest')
INSERT [dbo].[category_type] ([category_type]) VALUES (N'terrain')
INSERT [dbo].[category_type] ([category_type]) VALUES (N'walkLocations')
INSERT [dbo].[category_type] ([category_type]) VALUES (N'walkType')
INSERT [dbo].[category_type] ([category_type]) VALUES (N'warning')
GO
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'01', N'Dogs', N'Some vicious seeming dogs on the route, hopefully chained up.', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'02', N'Canal', N'Vegetation can obscure missing or broken tiles covering the canal.', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'04', N'Path', N'Narrow crumbling precipitous path. There have been many injuries and even deaths.', 1)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'04', N'Tunnels', N'Risk of clouting head', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'21', N'Cliff', N'The cliff path goes near the edge and is slippery with loose material.', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'22', N'Dogs', N'Yappy loose dogs on the initial climb.', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'24.1', N'High altitude', N'Come prepared for mountainous conditions', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'24.1', N'Precipitous', N'Avoid in poor visibility', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'24.1', N'Remote', N'No phone signal or easy way off the mountain', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'24.1', N'Winter ice', N'Slippery conditions and obscured trail markers', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'24.2', N'High altitude', N'Come prepared for mountainous conditions', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'24.2', N'Precipitous', N'Avoid in poor visibility', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'24.2', N'Remote', N'No phone signal or easy way off the mountain', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'24.2', N'Winter ice', N'Slippery conditions and obscured trail markers', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'25', N'High altitude', N'Come prepared for mountainous conditions', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'25', N'Precipitous', N'Avoid in poor visibility', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'25', N'Remote', N'No phone signal or easy way off the mountain', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'25', N'Winter ice', N'Slippery conditions and obscured trail markers', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'32', N'Trip hazard', N'The lava field can cause nasty injuries if you trip.', 0)
INSERT [dbo].[danger] ([route_id], [danger], [description], [is_strong]) VALUES (N'33', N'Losing the path', N'Much of the route is off marked trails so GPS may have to be relied upon.', 0)
GO
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'01', 1, N'route01-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'01', 0, N'route01-01-h525', 576, 525, N'Sugar mills near Santa Cruz')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'01', 0, N'route01-02-h525', 865, 525, N'Iglesia de El Salvador, Plaza de España')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'01', 0, N'route01-03-h525', 666, 525, N'Steep climb past colourful houses')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'02', 1, N'route02-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'02', 0, N'route02-01-h525', 788, 525, N'View over Santa Cruz from Mirador de la Concepción')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'02', 0, N'route02-02-h525', 699, 525, N'Canal de Breña, covered waterway')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'02', 0, N'route02-03-h525', 394, 525, N'Barranco de las Nieves (dried river bed)')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'02', 0, N'route02-04-h525', 788, 525, N'Castillo de La Virgen, at the walk finish')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'02', 0, N'route02-05-h525', 772, 525, N'Museo Naval (ship museum), at the walk finish')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'03', 1, N'route03-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'03', 0, N'route03-01-h525', 699, 525, N'One of the small shrines along the Camino de las Fuentes')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'03', 0, N'route03-02-h525', 394, 525, N'Ancient washing basins near the walk start')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'03', 0, N'route03-03-h525', 788, 525, N'Chestnut forest with many other species mixed in')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'04', 1, N'route04-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'04', 0, N'route04-01-h525', 525, 525, N'Gallery tunnel')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'04', 0, N'route04-02-h525', 699, 525, N'The gallery path has partial protection from the steep drops')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'04', 0, N'route04-03-h525', 394, 525, N'View into the valley from up high')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'04', 0, N'route04-04-h525', 788, 525, N'View over Santa Cruz on the descent')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'05', 1, N'route05-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'05', 0, N'route05-01-h525', 788, 525, N'Cliff view along the GR130')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'05', 0, N'route05-02-h525', 515, 525, N'Jacaranda tree at the Fuente de San Juan')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'05', 0, N'route05-03-h525', 699, 525, N'The only place where the GR130 actually meets the sea')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'06', 1, N'route06-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'06', 0, N'route06-01-h525', 699, 525, N'Small viaduct in the laurisilva forest.')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'06', 0, N'route06-02-h525', 614, 525, N'Deep in the laurisilva forest')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'06', 0, N'route06-03-h525', 512, 525, N'Mirador Somada Alta')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'06', 0, N'route06-04-h525', 862, 525, N'Caves along the PR LP 5 variant route')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'07', 1, N'route07-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'07', 0, N'route07-01-h525', 788, 525, N'Los Tilos Bridge')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'07', 0, N'route07-02-h525', 788, 525, N'Nuestra Senora de Montserrat (church), Los Sauces')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'08', 1, N'route08-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'08', 0, N'route08-01-h525', 626, 525, N'Sunny glade in the laurisilva forest.')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'08', 0, N'route08-02-h525', 394, 525, N'Mirador de las Barandas')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'08', 0, N'route08-03-h525', 350, 525, N'Looking up the Los Tilos valley')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'09', 1, N'route09-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'09', 0, N'route09-01-h525', 699, 525, N'Marcos y Cordero Springs')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'09', 0, N'route09-02-h525', 556, 525, N'Narrow gallery path approaching the tunnels')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'09', 0, N'route09-03-h525', 394, 525, N'Springs after the tunnels')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'09', 0, N'route09-04-h525', 350, 525, N'Cascada De Los Tilos (walk 9c)')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'09', 0, N'route09-05-h525', 699, 525, N'Some big boulders to negotiate on the descent')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'10', 1, N'route10-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'10', 0, N'route10-01-h525', 763, 525, N'La Tosca has a small dragon tree grove')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'10', 0, N'route10-02-h525', 788, 525, N'The approach to Gallegos')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'10', 0, N'route10-03-h525', 766, 525, N'Branch route leading to the sea')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'10', 0, N'route10-04-h525', 699, 525, N'Side branch descent to a beach')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'11', 1, N'route11-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'11', 0, N'route11-01-h525', 1280, 525, N'Unspoilt coastal scenery east of Garafia')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'11', 0, N'route11-02-h525', 699, 525, N'Barranco de los Hombres, approaching El Tablado')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'11', 0, N'route11-03-h525', 699, 525, N'Wind turbines near Juan Adalid')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'12', 1, N'route12-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'12', 0, N'route12-01-h525', 699, 525, N'Mirador on the path heading up to La Zarza')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'12', 0, N'route12-02-h525', 788, 525, N'Great dragon tree on path PL LP 9.3 approaching Garafia')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'12', 0, N'route12-03-h525', 699, 525, N'A seeming dead-end in the Barranco de Fagundo')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'13', 1, N'route13-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'13', 0, N'route13-01-h525', 420, 525, N'Puerto de Garafia')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'13', 0, N'route13-02-h525', 700, 525, N'Geodesic dome dwelling just off the path to the port')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'13', 0, N'route13-03-h525', 394, 525, N'Fisherman shacks at the port')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'13', 0, N'route13-04-h525', 699, 525, N'Ancient Guanches petroglyphs between the port and Garafia')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'13', 0, N'route13-05-h525', 525, 525, N'Farmland on the approach to Llano Negro')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'14', 1, N'route14-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'14', 0, N'route14-01-h525', 788, 525, N'Isolated house in a dragon tree grove')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'15', 1, N'route15-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'15', 0, N'route15-01-h525', 699, 525, N'Dried-up waterfall')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'15', 0, N'route15-02-h525', 699, 525, N'Descending to the riverbed')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'15', 0, N'route15-03-h525', 394, 525, N'Fuente de la Caldera del Agua')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'16', 1, N'route16-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'16', 0, N'route16-01-h525', 699, 525, N'Ascending from the Mirador de la Calzada')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'16', 0, N'route16-02-h525', 699, 525, N'Last of the barranco views before heading into the forest')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'16', 0, N'route16-03-h525', 699, 525, N'Entering the laurisilva forest')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'17', 1, N'route17-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'17', 0, N'route17-01-h525', 787, 525, N'Iglesia San Mauro de Abad')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'17', 0, N'route17-02-h525', 699, 525, N'Looking across the lower reaches of Puntagorda')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'17', 0, N'route17-03-h525', 394, 525, N'PR LP 11.1 near El Roque')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'17', 0, N'route17-04-h525', 700, 525, N'Mirador de los Dragos')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'18', 1, N'route18-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'18', 0, N'route18-01-h525', 788, 525, N'Puerto de Puntagorda')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'18', 0, N'route18-02-h525', 699, 525, N'Approaching the port along PR LP 11.2')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'18', 0, N'route18-03-h525', 699, 525, N'Descending to the slipway')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'18', 0, N'route18-04-h525', 788, 525, N'Cave house in the cliffs')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'19', 1, N'route19-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'19', 0, N'route19-01-h525', 787, 525, N'Approaching Las Tricias')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'19', 0, N'route19-02-h525', 350, 525, N'One of the best dragon trees on the island - on the GR130 path')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'19', 0, N'route19-03-h525', 347, 525, N'Free-range chickens along the GR130')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'19', 0, N'route19-04-h525', 700, 525, N'Cuevas de Buracas')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'19', 0, N'route19-05-h525', 639, 525, N'Barranco de Izcegua')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'20', 1, N'route20-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'20', 0, N'route20-01-h525', 753, 525, N'Open views along the west coast')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'20', 0, N'route20-02-h525', 699, 525, N'Cobbled camino section of the GR130')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'21', 1, N'route21-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'21', 0, N'route21-01-h525', 788, 525, N'Small community in the ''Pirates'' Bay')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'21', 0, N'route21-02-h525', 818, 525, N'Sheltered pool suitable for swimming')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'21', 0, N'route21-03-h525', 699, 525, N'Tricky descent to the beach')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'21', 0, N'route21-04-h525', 350, 525, N'Playa del Jorado')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'21', 0, N'route21-05-h525', 699, 525, N'Inside the small self-contained community')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'22', 1, N'route22-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'22', 0, N'route22-01-h525', 788, 525, N'Barranco de las Angustias')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'22', 0, N'route22-02-h525', 788, 525, N'Terraced vines on the north side of the barranco Angustias')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'23', 1, N'route23-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'23', 0, N'route23-01-h525', 699, 525, N'Los Llanos as seen from Miradoe El Time')
GO
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'23', 0, N'route23-02-h525', 394, 525, N'Puerto de Tazacorte from Miradoe de la Punta')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'23', 0, N'route23-03-h525', 936, 525, N'Los Llanos from Argual Abajo')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'23', 0, N'route23-04-h525', 699, 525, N'Where the GR130 and GR131 cross over')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'23', 0, N'route23-05-h525', 699, 525, N'Barranco de las Angustias from near the GR131 cross-over point')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'24.1', 1, N'route24.1-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'24.1', 0, N'route24.1-01-h525', 788, 525, N'Sunset over the clouds from Refugio Punta de los Roques')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'24.1', 0, N'route24.1-02-h525', 699, 525, N'Lobelia growing near Roque de Muchachos')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'24.1', 0, N'route24.1-03-h525', 788, 525, N'Pico de la Nieves')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'24.1', 0, N'route24.1-04-h525', 699, 525, N'North side of the crest nearing the refugio')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'24.1', 0, N'route24.1-05-h525', 788, 525, N'Late afternoon sun above the clouds on the GR131')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'24.2', 1, N'route24.2-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'24.2', 0, N'route24.2-01-h525', 788, 525, N'The Cumbre Nueva under cloud with Pico Birigoyo peaking through')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'24.2', 0, N'route24.2-02-h525', 1001, 525, N'Dawn with El Tiede on Tenerife poking above the clouds')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'25', 1, N'route25-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'25', 0, N'route25-01-h525', 706, 525, N'One of the many telescopes at the summit')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'25', 0, N'route25-02-h525', 1137, 525, N'Telescope cluster as seen from the GR131 path')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'25', 0, N'route25-03-h525', 699, 525, N'The GR131 heading towards Puerto de Tazacorte')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'25', 0, N'route25-04-h525', 716, 525, N'View from Roque Palmero')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'26', 1, N'route26-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'26', 0, N'route26-01-h525', 788, 525, N'Looking north-east from Playa de Taburiente')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'26', 0, N'route26-02-h525', 699, 525, N'View from Mirador Los Brecitos')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'26', 0, N'route26-03-h525', 699, 525, N'Descending to the riverbed')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'26', 0, N'route26-04-h525', 357, 525, N'Path soon after the campsite')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'26', 0, N'route26-05-h525', 711, 525, N'Cascada de Colores')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'26', 0, N'route26-06-h525', 394, 525, N'Near Dos Agua')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'27', 1, N'route27-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'27', 0, N'route27-01-h525', 1396, 525, N'Vista Cumbre Vieja')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'27', 0, N'route27-02-h525', 394, 525, N'Path connecting the Cumbrecita to Pico Bejenado')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'28', 1, N'route28-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'28', 0, N'route28-01-h525', 788, 525, N'view from Pico Bejenado looking towards Puerto Tazacorte')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'28', 0, N'route28-02-h525', 1299, 525, N'Caldera de Taburiente')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'28', 0, N'route28-03-h525', 699, 525, N'Climbing to Pico Bejenado')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'28', 0, N'route28-04-h525', 699, 525, N'Descending from Roque de Los Cuervos')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'29', 1, N'route29-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'29', 0, N'route29-01-h525', 788, 525, N'In the plains south of El Paso')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'29', 0, N'route29-02-h525', 788, 525, N'Llanos de Jable')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'29', 0, N'route29-03-h525', 413, 525, N'Crossing a lava field on PR LP 14')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'29', 0, N'route29-04-h525', 788, 525, N'Bikers at the foot of Montaña Quemada (Volcán Tacande)')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'30', 1, N'route30-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'30', 0, N'route30-01-h525', 699, 525, N'Where PR LP1 and the GR131 meet on the Cumbre Nueva')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'30', 0, N'route30-02-h525', 394, 525, N'Small shrine in the forest on PR LP 1')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'30', 0, N'route30-03-h525', 700, 525, N'Ermita de la Virgen del Pino')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'31', 1, N'route31-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'31', 0, N'route31-01-h525', 878, 525, N'Fayal-brezal (myrtl-heather) on the Cumbre Nueva')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'31', 0, N'route31-02-h525', 394, 525, N'Radio mast along the GR131')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'31', 0, N'route31-03-h525', 881, 525, N'View of the Caldera from the Cumbre Nueva')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'31', 0, N'route31-04-h525', 699, 525, N'Country lane around Tacande')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'32', 1, N'route32-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'32', 0, N'route32-01-h525', 788, 525, N'Lavas de San Juan')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'32', 0, N'route32-02-h525', 699, 525, N'Looking to the Cumbre Vieja from PR LP 14.1')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'32', 0, N'route32-03-h525', 699, 525, N'Poppy lined PR LP 14.1 path')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'33', 1, N'route33-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'33', 0, N'route33-01-h525', 699, 525, N'Unsigned but cairned path across the forest slope')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'33', 0, N'route33-02-h525', 699, 525, N'View from Montaña Marcos')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'33', 0, N'route33-03-h525', 699, 525, N'Montaña Marcos from near Jedy')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'34', 1, N'route34-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'34', 0, N'route34-01-h525', 912, 525, N'View of the Caldera over the Aridane plain')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'34', 0, N'route34-02-h525', 394, 525, N'Skirting Pico Birigoyo')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'34', 0, N'route34-03-h525', 1130, 525, N'The Malforda lava field and Volcán El Duraznero')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'34', 0, N'route34-04-h525', 699, 525, N'Hoyo Negro')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'34', 0, N'route34-05-h525', 788, 525, N'View of Tenerife from near Volcán de Martín')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'35', 1, N'route35-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'35', 0, N'route35-01-h525', 699, 525, N'Approaching the peak of Volcan Birigoyo')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'35', 0, N'route35-02-h525', 699, 525, N'Montaña la Barquita')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'35', 0, N'route35-03-h525', 537, 525, N'Towards Montaña la Barquita')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'35', 0, N'route35-04-h525', 699, 525, N'Near Pico Nambroque')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'36', 1, N'route36-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'36', 0, N'route36-01-h525', 699, 525, N'Ascending Volcán de Martín')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'36', 0, N'route36-02-h525', 788, 525, N'View from Volcán de Martín')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'36', 0, N'route36-03-h525', 699, 525, N'Picon (black pea-gravel) path at the base of Volcán de Martín')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'36', 0, N'route36-04-h525', 394, 525, N'Natural Bugloss rockery on SL FU 110')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'37', 1, N'route37-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'37', 0, N'route37-01-h525', 788, 525, N'Centro de Visitantes del San Antonio')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'37', 0, N'route37-02-h525', 700, 525, N'Volcán de San Antonio')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'37', 0, N'route37-03-h525', 788, 525, N'Path round crest of Volcán de San Antonio')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'38', 1, N'route38-01-250x187', 250, 187, NULL)
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'38', 0, N'route38-01-h525', 699, 525, N'New Faro de Fuencaliente with the old lighthouse (now a museum) behind')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'38', 0, N'route38-02-h525', 699, 525, N'Climbing Volcán de Teneguía')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'38', 0, N'route38-03-h525', 814, 525, N'Final crater rim walk to summit of Volcán de Teneguía')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'38', 0, N'route38-04-h525', 699, 525, N'Descending from Volcán de Teneguía to the lighthouses')
INSERT [dbo].[image] ([id], [is_thumbnail], [pic_id], [width], [height], [caption]) VALUES (N'38', 0, N'route38-05-h525', 350, 525, N'Salt pans next to the lighthouse')
GO
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Area Recreativa El Fayal', 28.778678894042969, -17.973037719726562, N'Plentiful, except at the weekends and holidays when there is a market.', N'El Pinar', N'Get off at the bus interchange point and walk down SL PG 61.', N'Recreation area with nearby market. Short walk from El Pinar.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Área Recreativa Fuente Los Roques', 28.519245147705078, -17.833219528198242, N'Plenty of spaces at the recreation area.', NULL, NULL, N'Accessed from a froestry path off the LP-2 road. Enquire at Los Canarios information centre for track conditions.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Argual Abajo', 28.654548645019531, -17.927770614624023, N'Plentiful parking but gets busy on market days.', N'Argual Abajo', NULL, N'Popular flea market in the plaza on Sundays.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Barlovento', 28.829290390014648, -17.802656173706055, N'Plenty of street parking in Barlovento. Car park near tourist information office.', N'Barlovento', NULL, N'Bus interchange.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Barranco de la Madera', 28.718162536621094, -17.813566207885742, N'None', NULL, NULL, N'Tunnels and precipitous path on the south side of the barranco', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Casa del Monte', 28.772838592529297, -17.811977386474609, N'Very limited.', NULL, NULL, N'Access is up a very steep, very rough dirt track for 4WD vehicles only.', N'4WD taxis carrying 8 passengers run from the taxi hut near the finish to Casa del Monte. Book in advance.')
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Cascada de Los Colores', 28.709867477416992, -17.876810073852539, N'None', NULL, NULL, NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Centro de Visitantes', 28.653657913208008, -17.852344512939453, N'Large car park at the rear, some parking in the front.', N'Centro de Visitantes', NULL, N'On the LP-3 road about half way between El Paso and the Cumbre Nueva tunnel.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Cuevas de Buracas', 28.793081283569336, -17.975664138793945, N'None', NULL, NULL, N'Accessible down well-paved path', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Don Pedro', 28.834033966064453, -17.895011901855469, N'Not really.', NULL, NULL, N'Taxi about 20€ to Santo domingo and 15€ to La Zarza', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'El Cubo de La Galga', 28.766887664794922, -17.769964218139648, N'Small car park that gets full pretty quickly.', N'Cubo de la Galga', N'The bus stop is in a brief gap between tunnels.', N'Information kisosk in the car park.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'El Jesús', 28.701250076293945, -17.951007843017578, N'Cervecería Isla Verde bar carpark.', N'El Jesús', NULL, NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'El Paso', 28.651863098144531, -17.881345748901367, N'Plenty of street parking along Avenida Islas Canarias and elsewhere.', N'El Paso', NULL, NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'El Pinar', 28.77496337890625, -17.978466033935547, N'Street parking', N'El Pinar', N'You can walk to Puntagorda just up the road.', N'Self-contained village and bus interchange.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'El Pinar parking spot', 28.705038070678711, -17.931741714477539, N'Layby by the wall with space for several cars', NULL, NULL, NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'El Roque', 28.756984710693359, -17.974353790283203, N'Small parking spot by a noticeboard.', N'El Roque', NULL, N'Nearby miradors and picnic area.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'El Tablado', 28.83348274230957, -17.877304077148438, N'Small, limited street parking on very narrow roads', NULL, NULL, NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Faro de Fuencaliente', 28.455778121948242, -17.843351364135742, N'Free (sizable) car park', N'Faro de Fuencaliente', N'Route 23 stops at Hotel Princess and Volcan San Antonio (on request).', N'There is a small beach near the lighthouses.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Franceses', 28.827644348144531, -17.858430862426758, N'Very restricted narrow streets with practically no parking options.', N'Franceses', NULL, NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Fuente del Toro', 28.6993408203125, -17.949600219726562, N'A couple of places directly in front and a car park opposite.', N'Fuente del Toro', NULL, N'Recreational area with water just a short walk from El Jesus.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Jedy', 28.584884643554688, -17.880485534667969, N'Parking spots up Calle Campanario and more further on up the track.', N'Jedy', N'Stop next to Bar Jedy', N'Small village but with tiny shop and Pizzeria Evangelina', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'La Viña car park', 28.685192108154297, -17.910127639770508, N'Ample spaces unless it''s the holidays', NULL, NULL, N'Shared taxis from La Viña car park run from 8:00 to 13:00 (12:00 autumn/winter) and charge 51€ per car seating 4 people to Los Brecitos.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'La Zarza', 28.805496215820312, -17.907428741455078, N'At the museum (included in ticket price or free on Mondays when the museum is closed) or roadside a little way down.', N'La Zarza', N'Request stop', N'Look for the big stone head statue by the side of the road.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Las Fuentes de Las Breñas', 28.658088684082031, -17.802064895629883, N'undefined', NULL, NULL, N'Access by foot only', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Las Nieves', 28.694292068481445, -17.7818603515625, N'Two car parks.', N'Santuario de Las Nieves', N'Bus stop almost directly in front of the church.', NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Las Tricias', 28.7806453704834, -17.963233947753906, N'A couple of small car parks.', N'Las Tricias', NULL, N'Tiny place but with restaurants and an tourist information centre.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Llano Negro', 28.805732727050781, -17.923761367797852, N'By the tourist information centre and various street options.', N'Llano Negro', N'Cafe/bar at the bus stop', N'Tiny place but has a shop, har and tourist information centre.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Los Brecitos', 28.711616516113281, -17.900642395019531, N'Small car park at the mirador.', NULL, NULL, N'The road from La Viña car park is wether dependent, and very narrow. Take a taxi.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Los Canarios', 28.493717193603516, -17.843242645263672, N'Street parking', N'Faro de Fuencaliente', N'Route 23 stops at Hotel Princess and Volcan San Antonio (request).', NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Los Dragos de Buracas', 28.79096794128418, -17.974906921386719, N'None', NULL, NULL, N'Only accessible by foot. On the GR 130 path between Las Tricias and Cuevas de Buracas.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Los Llanos de Aridane', 28.660612106323242, -17.9160213470459, N'Car park near the bus station and elsewhere.', N'Los Llanos', N'Bus station has some grotty toilets', N'Bus interchange.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Los Molinos', 28.68842887878418, -17.772008895874023, N'None', N'El Molino', NULL, N'Ascend via a staircase to the mills.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Los Sauces', 28.804279327392578, -17.774021148681641, N'Multiple small places, try Calle Vicente San Juan round the back of the big church.', N'Los Sauces', NULL, NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Los Tilos Taxi Hut', 28.791469573974609, -17.799369812011719, N'Some parking by the hut, more up the road.', NULL, NULL, N'Los Tilos visitor center is just up the road.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'MIGO', 28.789152145385742, -17.976175308227539, N'Some spaces at the museum', NULL, NULL, N'Incorporates the windmill', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Mirador de la Concepción', 28.673572540283203, -17.778318405151367, N'Some parking at the viewpoint.', N'Mirador Concepción', N'Stop is opposit the blue building. Walk up to the viewpoint.', NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Mirador El Time', 28.663518905639648, -17.942348480224609, N'Limited parking for restaurant patrons only', N'Mirador El Time', NULL, NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Pico de La Cruz access', 28.757244110107422, -17.8558349609375, N'undefined', NULL, NULL, N'Roadside parking spots near the PR LP 07/GR 131 intersection', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Pico de la Nieve access', 28.733098983764648, -17.822038650512695, N'undefined', NULL, NULL, N'Parking spot just off the LP-4 road where the PR LP 03 path intersects.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Pista de Valencia', 28.677978515625, -17.854255676269531, N'A couple of spaces where the tarmac ends, more at the notice board further up the track.', NULL, NULL, N'Taxi from Centro de Visitantes to the end of the tarmac.', N'15€ from the visitor centre.')
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Playa de Taburiente', 28.724580764770508, -17.876131057739258, N'undefined', NULL, NULL, N'Beach-like area on the Rio de Taburiente', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Plaza de España', 28.6833438873291, -17.764884948730469, N'Avenida Marítima and walk up.', N'Santa Cruz', N'Walk up along Calle O''Daly (Antigua Calle Real)', N'In front of Iglesia de El Salvador in the heart of the old town.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Plaza de la Constitución', 28.680843353271484, -17.766658782958984, N'Avenida Marítima or the port carpark', N'Santa Cruz', N'Main bus interchange along Avenida de Los Indianos', N'Traffic island', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Plaza la Alameda', 28.688079833984375, -17.761129379272461, N'Along the Avenida de las Nieves opposite.', N'Santa Cruz', N'Walk through the town to the bus station. If that''s too far, any bus along Avenida Marítima will get you there.', N'Ship museum, restaurants etc.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Porís de Candelaria', 28.703121185302734, -17.972400665283203, N'Two sizable parking spots at the end of Camino La Ermita.', NULL, NULL, N'Viewpoint between the parking spots.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Puente de Los Tilos', 28.798625946044922, -17.771211624145508, N'Some parking spots at either end of the bridge.', N'Los Sauces', N'There is an unnamed stop by the bridge which is closer.', NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Puerto de Garafía', 28.827129364013672, -17.967350006103516, N'Quite a large car park and a few spots on the approach road.', NULL, NULL, N'Popular with locals. Petroglyphs on the walk down.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Puerto de Tazacorte', 28.651252746582031, -17.945573806762695, N'Beachfront places fill up fast but there''s a carpark further up Calle Taburiente.', N'Mirador El Time', NULL, NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Punta de Los Roques', 28.70372200012207, -17.846019744873047, N'undefined', NULL, NULL, N'Spectacular viewpoint where the Caldera meets into the Cumbre Nueva', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Puntagorda tourist information centre', 28.765689849853516, -17.979681015014648, N'Adequate street parking nearby.', N'Puntagorda', N'Bus interchange is at El Pinar, one stop further on.', NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Refugio El Pilar', 28.614151000976562, -17.836494445800781, N'Multiple nearby parking spots.', NULL, NULL, N'Central recreational area where the Cumbre Nueva and Cumbre Vieja meet.', N'13€ from Centro de Visitantes')
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Roque de los Muchachos', 28.754228591918945, -17.884885787963867, N'Fairly small and busy car park.', NULL, NULL, N'Three viewpoints can be accessed from a path leading from the car park.', N'Taxis are 35€ from Garafia and 55€ from Santa Cruz. Tour buses may let you do a one way trip but at the cost of a later start.')
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Roque Palmero', 28.737628936767578, -17.8983097076416, N'undefined', NULL, NULL, N'Viewpoint accessed up a steep slippery slope.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'San Antonio', 28.817636489868164, -17.918569564819336, N'In the recreational area.', NULL, NULL, N'Picnic area, campsite, church and agricultural centre. Usually very busy or nearly empty.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'San Nicolás', 28.601917266845703, -17.881010055541992, N'Some parking by the church, more up Calle Tamanca by the Virgen de Fátima shrine.', N'San Nicolás', N'Stop is opposite the El Americano bar', N'You can walk to Centro de Interpretación del tubo volcánico Cueva de Las Palomas from here.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'San Pedro de Breña Alta', 28.662691116333008, -17.787696838378906, N'Car park at the rear of Plaza de Bujaz', N'San Pedro', NULL, N'Has an attractive plaza and some good restaurants.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Santa Cruz de La Palma', 28.680219650268555, -17.767875671386719, N'Park near Barco de la Virgen or on Avenida Marítima and walk to the start.', N'Santa Cruz', NULL, N'Bus interchange', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Santo Domingo de Garafía', 28.830636978149414, -17.944416046142578, N'By the stadium or along Calle Nueva.', N'Santo Domingo', NULL, NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Tacande', 28.638887405395508, -17.870569229125977, N'Parking spot by a wall at the start along Calle Cuesta de la Juliana.', NULL, NULL, N'Tacande is within walking distance of El Paso', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'The Cumbrecita', 28.697891235351562, -17.856689453125, N'Two small car parks.', NULL, NULL, N'Book in advance on the official website or come out of hours. Barrier on the approach road.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Tijarafe', 28.710973739624023, -17.95576286315918, N'Street parking, more by the sports stadium.', N'Tijarafe', NULL, N'Iglesia Nuestra Senora de la Candelaria is worth a visit.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Tinizara', 28.744827270507812, -17.968582153320312, N'Next to Bar Garome.', N'Tijarafe', NULL, NULL, NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Torre del Time', 28.69273567199707, -17.924449920654297, N'A few spaces near the tower.', NULL, NULL, N'Access down a dirt track.', NULL)
INSERT [dbo].[location] ([name], [latitude], [longitude], [parking], [bus_stop], [bus_notes], [notes], [taxi]) VALUES (N'Volcán San Antonio', 28.486827850341797, -17.848220825195312, N'Some free spaces before the entrance or in the carpark if you have a visitor centre ticket.', N'Volcán San Antonio', N'The visitor centre is a request stop', N'The volcano is a short walk down from Los Canarios', NULL)
GO
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Argual Abajo')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Cascada de Los Colores')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Centro de Visitantes')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'El Paso')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'La Viña car park')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Los Brecitos')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Los Llanos de Aridane')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Mirador El Time')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Pico de La Cruz access')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Pico de la Nieve access')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Pista de Valencia')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Playa de Taburiente')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Puerto de Tazacorte')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Punta de Los Roques')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Refugio El Pilar')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Roque de los Muchachos')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Roque Palmero')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Tacande')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'The Cumbrecita')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'central', N'Torre del Time')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'Barlovento')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'Barranco de la Madera')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'Casa del Monte')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'El Cubo de La Galga')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'Las Fuentes de Las Breñas')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'Las Nieves')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'Los Molinos')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'Los Sauces')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'Los Tilos Taxi Hut')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'Mirador de la Concepción')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'Plaza de España')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'Plaza de la Constitución')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'Plaza la Alameda')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'Puente de Los Tilos')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'San Pedro de Breña Alta')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'east', N'Santa Cruz de La Palma')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'Area Recreativa El Fayal')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'Barlovento')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'Cuevas de Buracas')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'Don Pedro')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'El Pinar')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'El Roque')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'El Tablado')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'Franceses')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'La Zarza')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'Las Tricias')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'Llano Negro')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'Los Dragos de Buracas')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'MIGO')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'Puerto de Garafía')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'Puntagorda tourist information centre')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'San Antonio')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'north', N'Santo Domingo de Garafía')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'south', N'Área Recreativa Fuente Los Roques')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'south', N'Faro de Fuencaliente')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'south', N'Jedy')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'south', N'Los Canarios')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'south', N'San Nicolás')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'south', N'Volcán San Antonio')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Area Recreativa El Fayal')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Argual Abajo')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Cuevas de Buracas')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'El Jesús')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'El Pinar')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'El Pinar parking spot')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'El Roque')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Fuente del Toro')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Jedy')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'La Zarza')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Las Tricias')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Llano Negro')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Los Dragos de Buracas')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Los Llanos de Aridane')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'MIGO')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Mirador El Time')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Porís de Candelaria')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Puerto de Garafía')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Puerto de Tazacorte')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Puntagorda tourist information centre')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'San Antonio')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'San Nicolás')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Santo Domingo de Garafía')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Tijarafe')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Tinizara')
INSERT [dbo].[location_area] ([area_name], [location]) VALUES (N'west', N'Torre del Time')
GO
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'01', N'Daily', N'08:30 - 19:30')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'01', N'Holidays', N'CLOSED')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'02', N'Daily', N'09:00 – 17:30')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'02', N'Daily (Jul - Sep)', N'10:00 – 18:30')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'03', N'Tue to Sat', N'09:00 - 17:00')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'03', N'Wed to Sun<br \/>(Jul - Sep)', N'10:00 - 18:00')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'04', N'Daily', N'09.00 - 19.00')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'06', N'Daily', N'09:00 - 18:00')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'07', N'Parking with reservation', N'08:30 - 16:00')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'07', N'Parking without reservation', N'Other times')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'12', N'Daily', N'Always open, no booking')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'16', N'Saturdays', N'13:00 - 19:00')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'16', N'Sundays', N'09:00 - 13:00')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'19', N'Holidays', N'10:00 - 14:30')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'19', N'Mon - Sat', N'10:00 - 18:00')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'19', N'Sundays', N'10:00 - 16:00')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'22', N'Mondays', N'CLOSED')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'22', N'Summer', N'11:00 - 19:00')
INSERT [dbo].[opening_time] ([poi_id], [time_period], [hours]) VALUES (N'22', N'Winter', N'11:00 - 17:00')
GO
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'01', N'The ''Glass House''', N'The ''Glass House'' tourist information centre', N'Lots of good information from friendly (generally) multi-lingual staff. Small bar situated right next door.', N'FREE', N'(+34) 922 412 106', N'oitaridane@lapalmacit.com', NULL, NULL, N'Plaza de la Constitución', N'In a traffic island where the bus station, port and old town meet.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'02', N'Volcán San Antonio', N'Volcán San Antonio Visitor Centre', N'Good geological exhibition, cafe & toilets. Also the place to arrange camel rides.', N'5€ (inc. parking)', N'(+34) 691 593 584', NULL, NULL, NULL, N'Los Canarios', N'Just south of Los Canarios (within walking distance).')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'03', N'Reserva Marina', N'Centro de Interpretación de la Reserva Marina', N'The old lighthouse with attached (not very good) museum.', N'2€', N'(+34) 922 480 223', N'reservasmarinas@mapya.es', NULL, NULL, N'Faro de Fuencaliente', N'In the far south of the island.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'04', N'Salinas de Fuencaliente', N'Salinas de Fuencaliente', N'Interesting self-guided tour around family-run salt pans. One of the island''s main visitor attractions.', N'FREE', N'(+34) 922 411 523<br \/>922 696 002', N'info@salinasdefuencaliente.com', N'Offical site', N'https://salinasdefuencaliente.es/', N'Faro de Fuencaliente', N'Next to the lighthouses in the far south.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'05', N'Refugio El Pilar', N'Refugio El Pilar', N'A hub for walks in the Cumbre Vieja. Toilets, BBQ pits, play area, campsite, water and a small mobile kiosk selling drinks and snacks.', NULL, NULL, NULL, NULL, NULL, N'Refugio El Pilar', N'Where the Cumbre Nueva turns into the Cumbre Vieja along the LP-301.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'06', N'Centro de Visitantes', N'Centro de Visitantes Caldera de Taburiente', N'The main visitor centre ideally situated for many walks. Has an exhibition, garden with rare plants, toilets, and a well-informed information desk.', N'FREE', N'(+34) 922 922 280', N'infcalde.cmayot@gobiernodecanarias.org', NULL, NULL, N'Centro de Visitantes', N'In the middle of the island a little east of El Paso along the LP-3.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'07', N'The Cumbrecita', N'The Cumbrecita', N'A saddle pint between Pico Bejenado and the Caldera with multiple viewpoints on a short easy circuit.', N'FREE', N'(+34) 922 922 280', N'informacion.taburiente@gobiernodecanarias.org', N'Car park booking', N'https://www.reservasparquesnacionales.es/real/ParquesNac/usu/html/detalle-actividad-oapn.aspx?ii=6ENG&cen=4&act=5', N'The Cumbrecita', N'North of the Centro de Visitantes at the end of the LP-302.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'08', N'Camping Caldera', N'Camping Caldera de Taburiente', N'Basic campsite in the heart of the Caldera ideal for exploring. No facilities except toilets and water.', N'FREE', N'(+34) 922 922 280', N'informacion.taburiente@gobiernodecanarias.org', N'Bookings', N'https://www.reservasparquesnacionales.es/real/ParquesNac/usu/html/detalle-actividad-oapn.aspx?cen=4&act=2', N'Playa de Taburiente', N'In the heart of the Caldera at the point the PR LP 13 route loops back.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'09', N'Playa de Taburiente', N'Playa de Taburiente', N'Pebble beach-like area at the far end of the Caldera', NULL, NULL, NULL, NULL, NULL, N'Playa de Taburiente', N'In the heart of the Caldera at the point the PR LP 13 route loops back.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'10', N'Roque de los Muchachos', N'Roque de los Muchachos', N'The highest point on the island at 2307.7m', NULL, NULL, NULL, NULL, NULL, N'Roque de los Muchachos', N'On the crater rim on the LP-4.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'11', N'Observatorio', N'Observatorio del Roque de los Muchachos', N'Collection of some 17 telescopes. Daytime visits and stargazing tours can be arranged.', NULL, NULL, NULL, NULL, NULL, N'Roque de los Muchachos', N'Just off the crater rim on the other side of Roque de los Muchachos.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'12', N'Refugio Punta de Los Roques', N'Refugio Punta de Los Roques', N'La Palma''s only functioning hiker hut sleeping 16. No toilets, probably no water.', N'FREE', NULL, NULL, NULL, NULL, N'Punta de Los Roques', N'Along the Caldera rim at the point the Caldera truns into the Cumbre Nueva.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'13', N'Mirador El Time', N'Mirador El Time', N'Popular viewpoint with restaurant/cafe and a couple of tourist shops.', NULL, NULL, NULL, NULL, NULL, N'Mirador El Time', N'Along the LP-1 as the road climbs out of the north side of the Barranco de las Angustias.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'14', N'Torre del Time', N'Torre del Time', N'Fire watch tower with viewpoint. Better views can be had further down the trail.', NULL, NULL, NULL, NULL, NULL, N'Torre del Time', N'West of El Jesus along the barranco edge. A track leads there.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'15', N'Pirate''s Bay', N'Pirate''s Bay', N'Timy hamlet officially known as Porís de Candelaria built into a cave setting with a swimming spot.', NULL, NULL, NULL, NULL, NULL, N'Porís de Candelaria', N'West of Tijarafe. A track leads down most of the way.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'16', N'Puntagorda Mercadillo', N'Mercadillo del Agricultor y Artensanal', N'Popular local market selling foods and handmade objects. Bar nearby.', N'FREE', N'+34 922 49 30 77', NULL, NULL, NULL, N'Area Recreativa El Fayal', N'North of the El Pinar part of Puntagorda.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'17', N'Miradores flotantes Izcagua', N'Miradores flotantes Izcagua', N'Series of daringly cantilivered glass-bottomed miragors overlooking the Barranco de Izcagua.', N'FREE', NULL, NULL, NULL, NULL, N'Area Recreativa El Fayal', N'North of the El Pinar part of Puntagorda next to the mercadillo.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'18', N'Cuevas de Buracas', N'Cuevas de Buracas', N'Historic caves with one staging a recreation of how the ancient Guanches may have lived.', NULL, NULL, NULL, NULL, NULL, N'Cuevas de Buracas', N'North-west of Las Tricias along the GR 130 (variant) path.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'19', N'MIGO', N'Molino de Buracas y Museo de Interpretación del Gofio (MIGO)', N'Historic grain mill and attached museum dedicated to gofio, the local roasted grain flour.', N'2.50€', N'(+34) 922 400 277 - 695 350 395', N'migo@garafia.org', N'Local council site', N'http://www.garafia.es/museo-de-interpretacion-del-gofio/', N'MIGO', N'North-west of Las tricias along the barranco edge down a drivable track.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'20', N'Los Dragos de Buracas', N'Los Dragos de Buracas', N'The most impressive dragon tree speciment on the island.', NULL, NULL, NULL, NULL, NULL, N'Los Dragos de Buracas', N'North-west of Las Tricias, Puntagorda, about half way to the Cuevas de Buracas.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'21', N'Mirador de los Dragos', N'Mirador de los Dragos', N'Famous leaning dragon tree and secondary mirador further on.', NULL, NULL, NULL, NULL, NULL, N'El Roque', N'A little south of Puntagorda where the Pista del Roque meets the LP-1.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'22', N'La Zarza', N'Parque Cultural La Zarza y La Zarcita', N'Archeological park and museum featuring some of the best preserved petroglyphs created by the aboriginal Guanches. Toilets.', N'3€ - includes parking', N'(+34) 922 69 50 05', NULL, N'Official site', N'https://garafialonatural.com/item/parque-cultural-la-zarza/', N'La Zarza', N'East of Llano Negro, Garafia.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'23', N'Puerto de Garafía', N'Puerto de Garafía', N'Beautiful port at the end of a rich coastal zone, a haven for birds. Ideal for watching the sun go down.', NULL, NULL, NULL, NULL, NULL, N'Puerto de Garafía', N'West of Santo Domingo de Garafia down the LP-1141.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'24', N'Barranco de la Madera', N'Barranco de la Madera', N'High narrow gallery path with tunnels, some in poor condition.', NULL, NULL, NULL, NULL, NULL, N'Barranco de la Madera', N'North-west of Las Nieves, north of Santa Cruz.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'25', N'Las Nieves', N'Las Nieves', N'Santuario de Nuestra Señora de Las Nieves church and bar/restaurant. Popular place.', NULL, NULL, NULL, NULL, NULL, N'Las Nieves', N'North-west of Santa Cruse along the LP-101.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'26', N'Las Fuentes de Las Breñas', N'Las Fuentes de Las Breñas', N'A series of natural springs (many now waterless), some decorated with small shrines.', NULL, NULL, NULL, NULL, NULL, N'Las Fuentes de Las Breñas', N'In the forest south-west of San Pedro')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'27', N'Mirador de la Concepción', N'Mirador de la Concepción', N'Crater rim providing exceptional views over Santa Cruz. A slightly unsafe dirt path leads out to a radio mast and on for more views.', NULL, NULL, NULL, NULL, NULL, N'Mirador de la Concepción', N'About half way between Santa Cruz and San Pedro')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'28', N'Los Molinos', N'Los Molinos', N'Historic water-driven sugar mills.', NULL, NULL, NULL, NULL, NULL, N'Los Molinos', N'Up the hill in Santa Cruz near Estadio Sylvestre Carrillo.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'29', N'Cascada de Los Colores', N'Cascada de Los Colores', N'Man-made waterfall interestingly coloured by minerals and vegetation.', NULL, NULL, NULL, NULL, NULL, N'Cascada de Los Colores', N'Off a signed side path on the PR LP 13 path in the heart of the Caldera.')
INSERT [dbo].[poi] ([id], [short_name], [full_name], [description], [entry_cost], [tel], [email], [web_name], [web_address], [location], [location_description]) VALUES (N'30', N'Puente de Los Tilos', N'Puente de Los Tilos', N'Famous bridge which was at one time the highest in Spain.', NULL, NULL, NULL, NULL, NULL, N'Puente de Los Tilos', N'At the LP-1/LP-105 junction. Within easy walking distance from Los Tilos.')
GO
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'01', 0, N'poi01-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'01', 1, N'poi01-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'02', 0, N'poi02-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'02', 1, N'poi02-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'03', 0, N'poi03-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'03', 1, N'poi03-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'04', 0, N'poi04-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'04', 1, N'poi04-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'05', 0, N'poi05-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'05', 1, N'poi05-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'06', 0, N'poi06-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'06', 1, N'poi06-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'07', 0, N'poi07-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'07', 1, N'poi07-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'08', 0, N'poi08-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'08', 1, N'poi08-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'09', 0, N'poi09-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'09', 1, N'poi09-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'10', 0, N'poi10-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'10', 1, N'poi10-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'11', 0, N'poi11-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'11', 1, N'poi11-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'12', 0, N'poi12-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'12', 1, N'poi12-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'13', 0, N'poi13-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'13', 1, N'poi13-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'14', 0, N'poi14-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'14', 1, N'poi14-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'15', 0, N'poi15-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'15', 1, N'poi15-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'16', 0, N'poi16-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'16', 1, N'poi16-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'17', 0, N'poi17-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'17', 1, N'poi17-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'18', 0, N'poi18-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'18', 1, N'poi18-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'19', 0, N'poi19-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'19', 1, N'poi19-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'20', 0, N'poi20-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'20', 1, N'poi20-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'21', 0, N'poi21-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'21', 1, N'poi21-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'22', 0, N'poi22-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'22', 1, N'poi22-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'23', 0, N'poi23-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'23', 1, N'poi23-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'24', 0, N'poi24-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'24', 1, N'poi24-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'25', 0, N'poi25-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'25', 1, N'poi25-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'26', 0, N'poi26-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'26', 1, N'poi26-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'27', 0, N'poi27-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'27', 1, N'poi27-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'28', 0, N'poi28-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'28', 1, N'poi28-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'29', 0, N'poi29-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'29', 1, N'poi29-250x187', 250, 187)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'30', 0, N'poi30-400x300', 400, 300)
INSERT [dbo].[poi_image] ([id], [is_thumbnail], [pic_id], [width], [height]) VALUES (N'30', 1, N'poi30-250x187', 250, 187)
GO
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'01', N'info')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'02', N'info')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'02', N'museum')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'02', N'refreshments')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'03', N'museum')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'04', N'museum')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'04', N'refreshments')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'05', N'camping')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'05', N'info')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'05', N'recreation')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'05', N'refreshments')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'06', N'building')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'06', N'info')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'06', N'museum')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'06', N'transport')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'07', N'info')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'07', N'nature')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'07', N'transport')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'08', N'camping')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'08', N'info')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'08', N'nature')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'09', N'nature')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'10', N'info')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'10', N'nature')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'11', N'building')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'11', N'tourism')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'12', N'camping')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'12', N'nature')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'13', N'tourism')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'14', N'building')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'15', N'building')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'16', N'recreation')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'16', N'refreshments')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'16', N'tourism')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'17', N'nature')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'17', N'tourism')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'18', N'archeology')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'19', N'building')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'19', N'museum')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'20', N'nature')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'21', N'nature')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'22', N'archeology')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'22', N'info')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'22', N'museum')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'23', N'nature')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'23', N'tourism')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'24', N'nature')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'25', N'nature')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'25', N'tourism')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'26', N'nature')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'27', N'nature')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'27', N'tourism')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'28', N'building')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'29', N'nature')
INSERT [dbo].[poi_tag] ([poi_id], [tag]) VALUES (N'30', N'building')
GO
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'01', NULL, N'Santa Cruz sugar mills', 8.3999996185302734, CAST(N'02:00:00' AS Time), N'Steep but varied walk passing historic sugar mills.', N'A short but steep circuit passing out of town past attractive houses with views along the way, then descending past the historic water mills and back down into town.', N'LP01 Sugar mills of Santa Cruz', N'Bar/Restaurants along LP-101 and at Las Nieves.', N'Plaza de España', N'Plaza de España', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'01a', N'01        ', N'Santa Cruz highlights', NULL, NULL, NULL, N'A fairly long and strenuous circuit taking in the best bits around Santa Cruz including a great viewpoint, a canal path through semi rural areas, the church at Las Nieves, a dry riverbed descent, and watermills.', N'LP01a Santa Cruz highlights', NULL, N'Plaza de España', N'Plaza de España', N'[01a] all the way')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'02', NULL, N'Mirador and waterways', 13, CAST(N'03:00:00' AS Time), N'Varied and sightly adventurous loop.', N'A varied walk taking in a spectacular viewpoint over Santa Cruz, a slightly adventurous walk along a water channel, a church with an important relic and a dried river bed full of big boulders. The walk ends at the ship museum.', N'LP02 Mirador and waterways', N'Bars and restaurants at the start and end points and on the way at Velhoco and Las Nieves.', N'San Pedro de Breña Alta', N'Plaza la Alameda', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'03', NULL, N'Woods and springs', 8.8000001907348633, CAST(N'02:15:00' AS Time), N'Chestnut and pine forest with small shrines at the many springs.', N'A pleasant forest walk with interest along the way from the many springs (most dry) and their sometimes fanciful and ornate decorative shrines.', N'LP03 Woods and springs', N'Bars and restaurants in San Pedro de Breña Alta.', N'San Pedro de Breña Alta', N'San Pedro de Breña Alta', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'03a', N'03        ', N'Descend to Santa Cruz', NULL, NULL, NULL, N'Walk 2 picks up where this walk leaves off so if you do this walk in the morning then after a lunch in the plaza you can finish the day by walking down to Santa Cruz initially following walk 2 then taking whichever route takes your fancy.', N'LP02 Mirador and waterways', NULL, N'San Pedro de Breña Alta', N'Santa Cruz de La Palma', N'[03] then [02]')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'04', NULL, N'Barranco de Mediera', 13, CAST(N'03:30:00' AS Time), N'Daring walk through tunnels along a precipitous cliff edge.', N'An adventurous barranco walk. The route climbs up the steep-sided barranco before turning round and returning on a spectacular and highly vertiginous route high up the rock face passing through tunnels and along a narrow gallery path with a sheer drop to the side before gradually becoming a more normal forest descent along switchbacks.', N'LP04 Barranco de Mediera', N'Bar/Restaurant at Las Nieves.', N'Las Nieves', N'Las Nieves', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'05', NULL, N'Puntallana to Los Sauces', 15.100000381469727, CAST(N'04:15:00' AS Time), N'East coast walk that dips down to the sea.', N'A long coastal walk along the only stretch of the GR 130 that actually goes close to the sea. Includes some lengthy stretches through dull banana plantations and a steep climb up to Los Sauces. Option to extend to the sea pools of Charco Azul.', N'LP05 Puntallana to Los Sauces', N'Bars, café, restaurant in Puntallana. Bar & restaurant in San Andrés. Bars, cafés, restaurants in Los Sauces.', N'Barlovento', N'Franceses', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'06', NULL, N'El Cubo de La Galga', 7.4000000953674316, CAST(N'02:05:00' AS Time), N'Popular walk through laurisilva forest with a nature trail for kids.', N'An easily accessed circuit through laurisilva jungle of high quality. Nearby restaurants and extension loops mean you can tailor your day easily.', N'LP06 Cubo de la Galga', N'None en route. Restaurant on PR LP 5 intersection with LP-1 road (walk 6b).', N'El Cubo de La Galga', N'El Cubo de La Galga', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'06a', N'06        ', N'Self-guided tour', NULL, NULL, NULL, N'The first road and track part of the walk can be done as an easy self-guided tour (free leaflet from the information office) suitable for children. The leaflet text is linked to numbered points along the trail.', NULL, NULL, N'El Cubo de La Galga', N'El Cubo de La Galga', N'[06](01 to 04) and back')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'06b', N'06        ', N'Cubo La Galga with coastal loop', NULL, NULL, NULL, N'For a full day''s walk that maybe incorporates a restaurant break on the way you can split from the main walk and follow the PR LP 5 all the way down to the coast along the terrific Barranco hondo de Nogales then loop back up to rejoin the original walk following PR LP 5.1.', N'LP06b Cubo La Galga coastal extension', NULL, N'El Cubo de La Galga', N'El Cubo de La Galga', N'[06](01 to 07) then [07b]')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'07', NULL, N'Los Tilos Bridge', 3, CAST(N'00:40:00' AS Time), N'Short exploration of the Los Tilos gorge and bridge.', N'A nice little circuit on a protected pedestrian walkway that lets you fully appreciate the bridge and the gorge it spans.', N'LP07 Los Tilos Bridge', N'Bars, cafés, restaurants in Los Sauces.', N'Puente de Los Tilos', N'Puente de Los Tilos', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'07a', N'07        ', N'Under the bridge figure of eight route', NULL, NULL, NULL, N'To see the bridge form all angles and both sides take the concrete path that leads down into the gorge and under the bridge (clearly visible from on top). Climb steeply out to the end of the bridge.', NULL, NULL, N'Puente de Los Tilos', N'Puente de Los Tilos', N'[06](01 to 02) then#follow the track down under the bridge and out the other side.')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'08', NULL, N'La Laguna', 15.399999618530273, CAST(N'04:10:00' AS Time), N'Laurisilva forest walk with well-regarded restaurant stop.', N'A steep climb leads into the protected laurisilva forest before descending to the rather dull lagoon. From there the way descends back to the road and traverses a couple of barrancos before circling back to the town.', N'LP08 La Laguna', N'Bars, cafés, restaurants in Los Sauces. Bar/restaurant at Laguna de Barlovento.', N'Barlovento', N'Barlovento', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'09', NULL, N'Marcos y Cordero Springs', 14, CAST(N'03:40:00' AS Time), N'Exciting downhill through tunnels to the springs.', N'A classic walk through numerous (wet) tunnels and a high gallery path to the impressive springs. The descent begins steeply with a semi-scramble down a boulder-filled river bed before becoming a more normal path down the gorge changing from pine forest to laurisilva jungle ending up near the Los Tilos visitor centre. 4WD shared taxi or tour is required to reach the start.', N'LP09 Marcos y Cordero Springs', N'Bar, café, restaurant Los Tilos Visitor Centre.', N'Casa del Monte', N'Los Tilos Taxi Hut', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'09a', N'09        ', N'To Mirador Espigon Altravesado', NULL, NULL, NULL, N'A good short walk is to do just the last part of the route in reverse as far as the mirador (perhaps also a little further on as far as the first bridge). It''s a very worthwhile laurisilva forest walk with a good viewpoint as reward.', NULL, NULL, N'Los Tilos Taxi Hut', N'Los Tilos Taxi Hut', N'[09](11 to 10) and back')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'09b', N'09        ', N'To the Springs', NULL, NULL, NULL, N'Fit walkers can do the walk in reverse up to the springs and then come back the same way saving the taxi fare. It''s really a very long climb up though. The full walk to Casa del Monte and down again will be too much for all but the fittest.', NULL, NULL, N'Los Tilos Taxi Hut', N'Los Tilos Taxi Hut', N'[09](11 to 07) and back')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'09c', N'09        ', N'To a waterfall (if it''s turned on!)', NULL, NULL, NULL, N'There''s a man-made waterfall near the visitor centre that''s beautifully framed and worth visiting. It''s only turned on though when there''s enough water.', NULL, NULL, N'Los Tilos Taxi Hut', N'Los Tilos Taxi Hut', N'Take the signed side trail between the taxi hut and the visitor centre')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'10', NULL, N'Barlovento to Franceses', 11.399999618530273, CAST(N'03:20:00' AS Time), N'Beautiful coastal walk with some large barrancos.', N'Long acknowledged as one of the most attractive sections of path on the island, this classic walk is a succession of wonderful far-reaching views along the coast punctuated by explorations into the barrancos and wanderings through the scattered villages and small farms on the way. It''s a fairly short and easy walk as far as Gallegos but the final barranco to Franceses is something else again and will consume about a third of your time.', N'LP10 Barlovento to Franceses', N'Bars, cafés, restaurants in Barlovento. Bar/shop and bar in Gallegos.', N'Barlovento', N'Franceses', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'10a', N'10        ', N'Barlovento to Gallegos', NULL, NULL, NULL, N'The bus stops at Gallegos so you can halt the walk there if you don''t fancy going all the way.', NULL, NULL, N'Barlovento', N'Franceses', N'[10](01 to 06)')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'10b', N'10        ', N'To Gallegos and back', NULL, NULL, NULL, N'The walk to Gallegos is short enough for a there-and back walk which would be justified given the attractiveness of the path.', NULL, NULL, N'Barlovento', N'Franceses', N'[10](01 to 06) and back')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'11', NULL, N'Franceses to Santo Domingo', 18.399999618530273, CAST(N'05:35:00' AS Time), N'Superb coastal scenery with two large barrancos.', N'One of the best stretches of coast on the island. There are a couple of large barrancos at the start that are full of interest but will take time to traverse.', N'LP11 Franceses to Santo Domingo', N'Bar in El Tablado. Bars, cafés and restaurants in Santo Domingo.', N'Franceses', N'Santo Domingo de Garafía', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'11a', N'11        ', N'Only as far as Don Pedro', NULL, NULL, NULL, N'If the whole walk seems too long you could call it a day early and get a taxi from Don Pedro', NULL, NULL, N'Franceses', N'Don Pedro', N'[11](01 to 09)')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'11b', N'11        ', N'One barranco only', NULL, NULL, NULL, N'You can choose to walk either barranco and get a look into the other without walking it.', NULL, NULL, N'El Tablado', N'El Tablado', N'[11](05 to 01) and back or#[11](05 to 07) and back')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'12', NULL, N'Big northern loop', 22.200000762939453, CAST(N'06:20:00' AS Time), N'Some of the best coastal scenery and laurasilva forest.', N'A long and very rewarding walk that needs an early start in the winter. The first section is a steep climb up to the La Zarza museum. You then descend into fabulous laurisilva forest before emerging on the coast for the final very scenic leg.', N'LP12 Big northern loop', N'Bars, cafés, restaurants in Santo Domingo. Restaurant in La Mata.', N'Santo Domingo de Garafía', N'Santo Domingo de Garafía', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'12a', N'12        ', N'Cut out the climb', NULL, NULL, NULL, N'The walk can be made more manageable by taking the bus to La Zarza.', NULL, NULL, N'La Zarza', N'Santo Domingo de Garafía', N'[12](11 to 27)')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'13', NULL, N'Puerto de Garafia', 15.399999618530273, CAST(N'04:30:00' AS Time), N'A beautiful and very varied walk that is full of interest.', N'A rather long but richly rewarding loop in three stages. The first leg is steeply up through pine forest to Llano Negro, then down through mixed landscapes to the attractive port and finally the coastal section leading back in to town.', N'LP13 Puerto de Garafia', N'Bars, cafés, restaurants in Santo Domingo. Bar/cafe in Llano Negro.', N'Santo Domingo de Garafía', N'Santo Domingo de Garafía', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'13a', N'13        ', N'Cut out the climb', NULL, NULL, NULL, N'The walk can be downgraded to a moderate effort level by taking the bus to Llano Negro and starting from there.', NULL, NULL, N'Llano Negro', N'Santo Domingo de Garafía', N'[13](06 to 15)')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'13b', N'13        ', N'Sunset stroll to the port', NULL, NULL, NULL, N'Enjoy the port at its best by taking a slow late afternoon stroll down. Stay for the sunset but remember to bring a torch (and perhaps insect repellent).', NULL, NULL, N'Santo Domingo de Garafía', N'Santo Domingo de Garafía', N'[13](15 to 11) and back')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'14', NULL, N'Bosque Dragos El Palmar', 5.0999999046325684, CAST(N'01:30:00' AS Time), N'Lovely little circuit to impressive dragon trees.', N'A very pleasant short walk along some attractive coast to a little known dragon tree grove. The descent is down a steep cobbled track.', N'LP14 Bosque Dragos El Palmar', N'Bars/cafés/restaurants in Santo Domingo.', N'Santo Domingo de Garafía', N'Santo Domingo de Garafía', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'15', NULL, N'Caldera de Agua', 5.1999998092651367, CAST(N'01:30:00' AS Time), N'Dark and mysterious laurisilva forest walk with picnic opportunities.', N'A visit to the museum at La Zarza goes well with this little circuit that descends through deep dark laurisilva forest encountering several mini calderas on the way. The path exits the forest and completes the loop by way of a large recreation ground with good BBQ facilities.', N'LP15 Caldera de Agua', N'Restaurant at La Mata. Bar/café in Llano Negro bus station. Picnic/BBQ facilities at San Antonio del Monte recreational area.', N'La Zarza', N'La Zarza', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'16', NULL, N'Laurisilva forest loop', 12.100000381469727, CAST(N'03:25:00' AS Time), N'A longer version of walk 15 that goes down to the coast.', N'A long descent through some of the finest laurisilva forest on the island to the coast where there are spectacular views before a return on a different but parallel path.', N'LP16 Larisilva forest loop', N'Restaurant at La Mata. Bar/cafe in Llano Negro bus station.', N'La Zarza', N'La Zarza', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'16a', N'16        ', N'Half the walk', NULL, NULL, NULL, N'For a shorter version that keeps all the good bits of the Caldera de Agua but looses the coast and barranco views it''s possible to take a shortcut on a well signed small road about half way down.', NULL, NULL, N'La Zarza', N'La Zarza', N'[16](01 to 10) then#signed shortcut, then#[16](20 to 22)')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'16b', N'16        ', N'Double barranco finish in Franceses', NULL, NULL, NULL, N'An alternative finish is to keep on the GR 130 after Mirador la Calzada and walk the two spectacular barrancos to Franceses and catch the bus back.', N'LP11 Franceses to Santo Domingo', NULL, N'La Zarza', N'Franceses', N'[16](01 to 15) then#[11](08 to 01)')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'17', NULL, N'Around Puntagorda', 5.1999998092651367, CAST(N'01:30:00' AS Time), N'Varied and beautiful walk around the semi-rural bits of Puntagorda.', N'A delightful circuit around Puntagorda with great variety taking in an iconic dragon tree, giant vegetation, and lovely views of the semi-rural countryside.', N'LP17 Around Puntagorda', N'Bars, cafés, restaurants in Puntagorda.', N'Puntagorda tourist information centre', N'Puntagorda tourist information centre', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'17a', N'17        ', N'Miradors and barranco slope', NULL, NULL, NULL, N'From El roque you could visit the two miradors and then explore as far as the end of the pine forest zone before returning the same way.', NULL, NULL, N'El Roque', N'El Roque', N'[17](05 to 08) and back')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'18', NULL, N'Puerto de Puntagorda', 10.100000381469727, CAST(N'03:15:00' AS Time), N'A walk to a port through the local countryside.', N'The port makes an attractive destination but this walk is mostly about getting there and back by way of the semi-wild coastal slopes experiencing something of the local life on the way.', N'LP18 Puerto de Puntagorda', N'Bars, cafes, restaurants in Puntagorda.', N'Puntagorda tourist information centre', N'Puntagorda tourist information centre', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'19', NULL, N'El Pinar to Cuevas de Buraca', 13.5, CAST(N'04:00:00' AS Time), N'Dragon trees, caves and a spectacular barranco.', N'The traditional walk from near Las Tricias to Cuevas de Buraca but with an exploration of the impressive Barranco de Izcegua thrown in to make a long varied walk.', N'LP19 El Pinar to Cuevas de Buraca', N'Bar and market at the start on weekends. Bars, restaurants, cafe, shops in El Pinar. Restaurant in Las Tricias. Cafe near the caves.', N'Area Recreativa El Fayal', N'Area Recreativa El Fayal', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'19a', N'19        ', N'Las Tricias to Cuevas de Buraca', NULL, NULL, NULL, N'The traditional easy circuit around Las Tricias to the caves passing one of the most famous and photogenic dragon tree groves on the way and a Gofio museum on the return leg.', N'LP19a Las Tricias to Cuevas de Buraca', NULL, N'Las Tricias', N'Las Tricias', N'[19a]')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'19b', N'19        ', N'Barranco de Izcegua', NULL, NULL, NULL, N'An exploration of the impressive Barranco de Izcegua between Puntagorda and Las Tricias made possible by a newly constructed path.', N'LP19b Barranco de Izcegua', NULL, N'Area Recreativa El Fayal', N'Area Recreativa El Fayal', N'[19b]')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'20', NULL, N'Tinizara to Tijarafe', 6.1999998092651367, CAST(N'01:40:00' AS Time), N'A gentle stroll through semi-domestic countryside.', N'A popular and easy walk through pretty and varied countryside. Unchallenging but full of interest. Waypoint 06 ends the walk.', N'LP20 Tinizara to Tijarafe', N'Bar/café in Tinizara. Bars, cafés, restaurants, shops in Tijarafe. Bar/café in El Jesús.', N'Tinizara', N'Tijarafe', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'20a', N'20        ', N'Extending to El Jesús via Barranco del Jurado', NULL, NULL, NULL, N'The barranco is a good one and worth walking, perhaps after lunch in Tijarafe and then taking the bus to El Jesús to walk it in reverse.', NULL, NULL, N'Tinizara', N'El Jesús', N'[20]')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'21', NULL, N'Pirates Bay', 11.600000381469727, CAST(N'03:45:00' AS Time), N'Astonishing tiny cave community via an impressive barranco.', N'A fairly long descent through the Barranco del Jurado and exposed cliff paths to a nice little beach community then up and over to Pirate’s Bay which is an astonishing hidden hamlet.', N'LP21 Pirates Bay', N'Bars, cafés, restaurants in Tijirafe.', N'Tijarafe', N'Tijarafe', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'21a', N'21        ', N'Combine with walk 20 for a big day', NULL, NULL, NULL, N'Walk 20 ends where this walk starts so combining them makes sense for those looking for a full day of walking.', N'LP20 Tinizara to Tijarafe', NULL, N'Tinizara', N'Tijarafe', N'[20](01 to 08) then#[21](03 to 13)')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'21b', N'21        ', N'Drive there and walk to Playa del Jurado', NULL, NULL, NULL, N'You can drive down to near the Porís de Candelaria, park up, and visit Pirates'' Bay before walking the comparatively short distance over to the Playa del Jurado and back.', NULL, NULL, N'Porís de Candelaria', N'Porís de Candelaria', N'[21](09 to 06) and back')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'22', NULL, N'Torre del Time', 14, CAST(N'04:00:00' AS Time), N'Interesting but steep climb to the Barranco de las Angustias edge.', N'A walk with a lot of steep climbing on a path rich in plants to reach the edge of the island’s largest barranco for great views. The way back takes a pretty forest path after visiting the tower.', N'LP22b Torre del Time to Mirador El Time', N'Cervecería Isla Verde', N'Fuente del Toro', N'Fuente del Toro', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'22a', N'22        ', N'Shorter, easier option if you have a car', NULL, NULL, NULL, N'Walk 22 with the initial climb subtracted.', NULL, NULL, N'El Pinar parking spot', N'El Pinar parking spot', N'[22](07 to 07) loop')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'22b', N'22        ', N'Descend to Mirador El Time', NULL, NULL, NULL, N'A great stretch of (unmarked) linking path with stupendous views but for good weather only.', N'LP22b Torre del Time to Mirador El Time', NULL, N'Fuente del Toro', N'Mirador El Time', N'[22](01 to 11) then#[22b]')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'23', NULL, N'Mirador El Time', 8.8999996185302734, CAST(N'02:40:00' AS Time), N'Crossing the Barranco de las Angustias with views all the way.', N'After descending to the dry river bed there’s a steep climb up the opposite side but it’s perhaps not as bad as it looks. The mirador café provides refreshments then it’s down to another mirador with views of Puerto de Tazacorte followed by a steep but easy walk down to the beach.', N'LP23 Mirador El Time', N'Restaurant at Argual Abajo. Bar/café at Mirador El Time. Multiple bars, restaurants, cafés, shop in Puerto de Tazacorte.', N'Argual Abajo', N'Puerto de Tazacorte', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'23a', N'23        ', N'Puerto de Tazacorte to the cliff top', NULL, NULL, NULL, N'You can easily make the climb to the viewing platform at the top from the beach – people do it in flip-flops – and it''s a nice leg-stretcher if you''re having a lazy beach day', NULL, NULL, N'Puerto de Tazacorte', N'Puerto de Tazacorte', N'[23](13 to 11) and back')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'23b', N'23        ', N'Descend from Mirador El Time', NULL, NULL, NULL, N'Leave the car in the port and take the bus to the mirador and walk down.', NULL, NULL, N'Mirador El Time', N'Puerto de Tazacorte', N'[23](10 to 13)')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'24.1', NULL, N'Roque de Muchachos to Refugio', 14.300000190734863, CAST(N'04:00:00' AS Time), N'A spectacular two day hike along the Caldera rim.', N'First half of a spectacular 2 day hike along the Caldera rim ending in a very basic but wonderfully sited refuge. Wonderful views all along with a few peaks (some rather windy) but none a difficult climb.', N'LP24.1 Roque de Muchachos to Refugio', N'None', N'Roque de los Muchachos', N'Punta de Los Roques', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'24.2', NULL, N'Refugio to Centro de Visitantes', 10.199999809265137, CAST(N'03:30:00' AS Time), N'Day two of the best walk on the island.', N'Second half of a spectacular two day hike along the Caldera rim. An easy and very beautiful descent along the Cumbre Nueva gradually changing from pine forest to laurisilva jungle as the clouds are entered. A steep descent then from the ridge followed by gentle country lanes', N'LP24.2 Refugio to Centro de Visitantes', N'None', N'Punta de Los Roques', N'Centro de Visitantes', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'24a', N'24.1      ', N'Roque de Muchachos to Mirador de los Andenes', NULL, NULL, NULL, N'A short walk to another viewpoint along the Caldera crest.', NULL, NULL, N'Roque de los Muchachos', N'Roque de los Muchachos', N'[24.1](01 to 05) and back')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'24b', N'24.1      ', N'From Pico de la Cruz', NULL, NULL, NULL, N'Short walks to Pico de la Nieve or Mirador de los Andenes.', NULL, NULL, N'Pico de La Cruz access', N'Pico de La Cruz access', N'To Pico de la Nieve:#[24.1](08 to 11) and back#To Mirador de los Andenes:# [24.1](08 to 02) and back')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'24c', N'24.1      ', N'Climb to Pico de la Nieve', NULL, NULL, NULL, N'Spectacular peak that can be climbed.', N'LP24c Pico de la Nieve', NULL, N'Pico de la Nieve access', N'Pico de la Nieve access', N'[24c]')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'24d', N'24.1      ', N'Pico de la Nieve to Centro de Visitantes', NULL, NULL, NULL, N'A shorter version of the 2-day route that can be done in a day with a taxi to the start.', NULL, NULL, N'Pico de la Nieve access', N'Centro de Visitantes', N'[24c](01 to 09) then#[24.1](16 to 21) then#[24.2]')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'25', NULL, N'Roque Palmero', 7.3000001907348633, CAST(N'02:10:00' AS Time), N'Explore away from the crowds along the Caldera crest.', N'A walk from the main (crowded) viewing point along the Caldera rim down to another much less visited viewpoint.', N'LP25 Roque de los Muchachos to Roque Palmero', N'None', N'Roque de los Muchachos', N'Roque Palmero', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'26', NULL, N'Barranco de las Angustias', 15.100000381469727, CAST(N'04:10:00' AS Time), N'Circuit through the Caldera interior.', N'A classic hike through the largest barranco on the island. A shared taxi is needed to get to start viewpoint then it’s an easy forest walk down to the river and ‘beach’. The return route is rather more strenuous but still mostly downhill following the river bed or the higher-level path that continually crosses it.', N'LP26 Barranco de las Angustias', N'None', N'Los Brecitos', N'La Viña car park', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'26a', N'26        ', N'To Cascada de Colores and back', NULL, NULL, NULL, N'The walk up to the Cascada de Colores and back is a worthwhile alternative to the main walk. For variety you can follow the river all the way up and take the path on the way down when it offers an alternative.', NULL, NULL, N'La Viña car park', N'La Viña car park', N'[26](17 to 11) and back')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'26b', N'26        ', N'Playa de Taburiente to Mirador Cascada de La Fondada', NULL, NULL, NULL, N'Add-on walk to a waterfall for the very fit or those camping.', N'LP26b Playa de Taburiente to Mirador Cascada de La Fondada', NULL, N'Playa de Taburiente', N'Playa de Taburiente', N'[26b]')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'27', NULL, N'La Cumbrecita', 19.600000381469727, CAST(N'04:45:00' AS Time), N'Forest climb to the saddle point between the Caldera and Pico Bejenado.', N'A lengthy though undemanding forest climb to the Cumbrecita viewpoints with a couple of good miradors on the way. After a circuit of the Cumbrecita viewpoints the way descends rather more easily on the road with opportunities to get off the road on to forest paths.', N'LP27 La Cumbrecita', N'None', N'Centro de Visitantes', N'Centro de Visitantes', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'27a', N'27        ', N'Just the La Cumbrecita viewpoints by car', NULL, NULL, NULL, N'A good option if you''re having a day off ''proper'' walking but still want to stretch your legs. You need to book your parking slot in advance or arrive out of hours.', NULL, NULL, N'The Cumbrecita', N'The Cumbrecita', N'[27](10 to 16)')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'27b', N'27        ', N'Taxi up then walk down', NULL, NULL, NULL, N'Taking a taxi to the top, completing a summit circuit, and then walking down the forest route is a popular choice.', NULL, NULL, N'The Cumbrecita', N'Centro de Visitantes', N'[27](10 to 16) then [27](10 to 01)')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'27c', N'27        ', N'Side trip to Pico Bejenado', NULL, NULL, NULL, N'If you are driving up to La Cumbrecita then you can make a proper walk of it by tacking on a side trip to Pico Bejenado. Allow enough time with some to spare when booking your parking permit.', N'LP27d To Pico Bejenado and return to the visitor centre', NULL, N'The Cumbrecita', N'The Cumbrecita', N'[27d](01 to 11 then back to 07)')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'27d', N'27        ', N'To Pico Bejenado & return to the visitor centre', NULL, NULL, NULL, N'Taxi to the start, Cumbracita circuit, Pico Bejenado, and long walk down to the visitor centre.', N'LP27d To Pico Bejenado and return to the visitor centre', NULL, N'The Cumbrecita', N'Centro de Visitantes', N'[27d] all the way')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'28', NULL, N'Pico Bejenado circuit', 12.199999809265137, CAST(N'03:20:00' AS Time), N'Climb to the island''s only true peak with far reaching views.', N'A very picturesque circuit of the big volcano linking to La Cumbrecita. The views from on top are worth the sometimes steep climb but the whole circuit is a pleasant walk.', N'LP28 Pico Bejenado circuit', N'None', N'Pista de Valencia', N'Pista de Valencia', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'28a', N'28        ', N'Taxi up then descend to the visitor centre', NULL, NULL, NULL, N'Taking a taxi to the start from the visitor centre lets you extend the walk by walking back down on PR LP 13.3', N'LP28a Pista de Valencia to Centro de Visitantes', NULL, N'Pista de Valencia', N'Centro de Visitantes', N'[28] then [28a]')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'28b', N'28        ', N'Taxi up then descend to El Paso', NULL, NULL, NULL, N'Forest descent opening out to abandoned terraces and meadows near El Paso.', N'LP28b Pista de Valencia to El Paso', NULL, N'Pista de Valencia', N'El Paso', N'[28] then [28b]')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'29', NULL, N'Llano de Jable', 9.3999996185302734, CAST(N'02:40:00' AS Time), N'An attractive open volcanic plane, a lava field and country lanes.', N'A fairly lengthy forest climb to a lovely open area of volcanic sand and good views followed by an interesting descent through a lava field and an unsigned wander through country lanes.', N'LP29 Llano de Jable', N'None', N'Tacande', N'Tacande', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'30', NULL, N'Trans Cumbre', 11, CAST(N'03:20:00' AS Time), N'Historic route over the Cumbre with views of both sides from the top.', N'A transverse crossing of the Cumbre Nueva passing from country lanes to pine forest, clouds (probably), then dark and mossy cobbles and paths and finally to a more open wooded final stretch.', N'LP30 Trans Cumbre', N'Bars, restaurants, cafés, shops in Breña Alta', N'Centro de Visitantes', N'San Pedro de Breña Alta', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'31', NULL, N'Cumbre Nueva loop', 17.100000381469727, CAST(N'04:40:00' AS Time), N'Long circuit that rewards with some fine views on a clear day.', N'A big circuit climbing up to Refugio El Pilar, traversing the Cumbre Nueva, then descending steeply down back to the start.', N'LP31 Cumbre Nueva loop', N'Possible snack from kiosk at Refugio El Pilar', N'Centro de Visitantes', N'Centro de Visitantes', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'31a', N'31        ', N'El Pilar to Reventon Pass', NULL, NULL, NULL, N'With a car you can walk the Cumbre Nueva on its own following the forestry path in one direction and the GR 131 in the other.', NULL, NULL, N'Refugio El Pilar', N'Refugio El Pilar', N'[31](09 to 13) and back')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'32', NULL, N'Lavas de San Juan', 10, CAST(N'03:00:00' AS Time), N'Traverse of the most dramatic lava field on the island.', N'An exploration of one of the most dramatic lava fields on the island with a scarily big (but well protected) hole to peer down into as well.', N'LP32 Lavas de San Juan', N'Bars/cafés in San Nicholas.', N'San Nicolás', N'San Nicolás', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'33', NULL, N'Montaña Marcos', 10, CAST(N'02:55:00' AS Time), N'Peak with views and beautiful pine forest.', N'A climb up to an interesting peak with good views and a nice easy section through the forest. If you’re lucky you may see paragliders taking off from a platform part way up.', N'LP33 Montana Marcos', N'Bar/café, pizza parlour, and a small shop in Jedy', N'Jedy', N'Jedy', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'33a', N'33        ', N'Link with walk 32 to make a big loop', NULL, NULL, NULL, N'To combine the walks without doing them individually you can use a short linking section of track that cuts out the less interesting descent from Montaña Marcos and joins the San Nicholas walk somewhere near Hoyo Grande. To complete the circuit a short easy section of the GR 130 is followed linking San Nicholas to Jedy.', N'LP32 Lavas de San Juan', NULL, N'Jedy', N'Jedy', N'[33](01 to 14) then#short linking track to [32]#then [32](04 to 11) then#GR 130 back to Jedy')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'34', NULL, N'The Volcano Route', 18.299999237060547, CAST(N'04:10:00' AS Time), N'Long but rewarding descent down the Cumbre Vieja.', N'The classic hike along the volcanic spine of the island with multiple peak-bagging opportunities on the way. Great views all along and varied scenery ending in a descent through pine forest.', N'LP34 The Volcano Route', N'Mobile kiosk at the start. Bars, cafés, restaurants and shops in Los Canarios.', N'Refugio El Pilar', N'Los Canarios', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'34a', N'34        ', N'To Pico Nambroque and back', NULL, NULL, NULL, N'After Pico Nambroque it''s probably not much more effort to complete the whole walk rather than return to Refugio El Pilar. If you are just looking to avoid an expensive taxi ride back then you can go as far as Deseada before returning.', NULL, NULL, N'Refugio El Pilar', N'Refugio El Pilar', N'[34](01 to 09) and back')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'34b', N'34        ', N'Continue down to the sea', NULL, NULL, NULL, N'Fit walkers can complete the route ''properly'' by finishing at the lighthouses.', N'LP38 Volcan Teneguia to the lighthouses', NULL, N'Refugio El Pilar', N'Faro de Fuencaliente', N'[34] then [38]')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'35', NULL, N'Pico Birigoyo circuit', 13, CAST(N'03:35:00' AS Time), N'The ''real'' volcano route that goes over the peaks.', N'This walk takes the high line along the volcanic peaks. It’s an alternative to the first part of the Volcano Route which follows a lower line not climbing the peaks. Spectacular views but very windy. Finishes by looping back through pleasant easy tracks.', N'LP35 Pico Birigoyo circuit', N'Mobile kiosk at Refugio El Pilar serves drinks and snacks.', N'Refugio El Pilar', N'Refugio El Pilar', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'36', NULL, N'Volcán de Martín', 8.8000001907348633, CAST(N'02:15:00' AS Time), N'Colourful volcanic landscapes and wide ranging views.', N'Starting from Área Recreativa Fuente Los Roques the walk goes through some lovely volcanic landscapes before climbing the volcano and descending by way of a lava field. Great views all along. The start requires a car to get to but you can also walk the last bit of the Volcano Route in reverse to reach the trail.', N'LP36 Volcan Martin', N'Bars, cafés and restaurants in Los Canarios', N'Área Recreativa Fuente Los Roques', N'Área Recreativa Fuente Los Roques', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'36a', N'36        ', N'Walk up from Los Canarios', NULL, NULL, NULL, N'Access for non-drivers by walking up from Los Canarios.', N'LP34 The Volcano Route', NULL, N'Los Canarios', N'Los Canarios', N'[34](22 to 18) then#[36](02 to 02) loop, then#[34](18 to 22)')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'37', NULL, N'Volcan San Antonio', 5.9000000953674316, CAST(N'01:30:00' AS Time), N'A simple walk around Volcán San Antonio.', N'An easy circuit of the volcano if you want something more than just the summit climb. Takes in some faint petroglyphs on the way.', N'LP37 Volcan San Antonio', N'Café in the visitor centre and a restaurant near the access road.', N'Volcán San Antonio', N'Volcán San Antonio', NULL)
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'37a', N'37        ', N'Walk 38 with Volcán Teneguía summit', NULL, NULL, NULL, N'Add-on to climb the peak', N'LP38 Volcan Teneguia to the lighthouses', NULL, N'Volcán San Antonio', N'Volcán San Antonio', N'[37](01 to 06) then#[38](09 to 12) and back, then#[37](06 to 12)')
INSERT [dbo].[route] ([id], [variant_of], [name], [length_km], [walking_time], [short_description], [description], [route_file], [refreshments], [start], [finish], [directions]) VALUES (N'38', NULL, N'Volcan Teneguia to the lighthouses', 7.5999999046325684, CAST(N'02:00:00' AS Time), N'Volcanic descent with peak-bagging opportunity.', N'After circling Volcán San Antonio and climbing Volcán Teneguia (optional) the path descends through a volcanic wasteland to the lighthouses, salt pans and sea at the southern tip of the island.', N'LP38 Volcan Teneguia to the lighthouses', N'Bars/cafés/restaurants and shops in Los Canarios. Café in the visitor centre, restaurant near the access road. Restaurant by the salt pans in Faro de Fuencaliente.', N'Los Canarios', N'Faro de Fuencaliente', NULL)
GO
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01', N'poi', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01', N'starred', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01', N'steep', 1, N'Quite a lot of climbing on steep tarmac, hard on the ankles.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01', N'urban', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01', N'views', 0, N'Lots of good views over Santa Cruz and the mills from afar.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01a', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01a', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'01a', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'02', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'02', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'02', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'02', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'02', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'02', N'riverbed', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'02', N'slippery', 0, N'Some muddy sections in the woods')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'02', N'vertigo', 0, N'The Mirador de la Concepción track can get vertiginous.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'02', N'views', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'03', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'03', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'03', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'03', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'03', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'03', N'pine', 0, N'The forest is mixed with chestnut and even some palms amongst the pine.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'03', N'poi', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'03', N'slippery', 0, N'Some muddy sections in the woods')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'03', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'03a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'03a', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'03a', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'03a', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'04', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'04', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'04', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'04', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'04', N'gps', 1, N'No signal deep in the barranco. No phone signal either.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'04', N'poi', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'04', N'riverbed', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'04', N'rockfall', 0, N'The tunnels are in a state of gradual collapse.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'04', N'slippery', 0, N'Loose material, particularly on the descent.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'04', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'04', N'vertigo', 1, N'Very high risk of vertigo on the gallery path.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'04', N'views', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'04', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'05', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'05', N'coastal', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'05', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'05', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'05', N'scenic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'05', N'steep', 0, N'The climb up to Los Sauces can be a bit of a strain.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'05', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'05', N'views', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'05', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06', N'laurisilva', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06', N'slippery', 0, N'Muddy and/or clay underfoot.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06', N'views', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06a', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06a', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06a', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06b', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06b', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06b', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06b', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'06b', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'07', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'07', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'07', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'07', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'07', N'poi', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'07', N'riverbed', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'07', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'07', N'views', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'07a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'07a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'07a', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'07a', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'07a', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'08', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'08', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'08', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'08', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'08', N'laurisilva', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'08', N'slippery', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'08', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'08', N'views', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'08', N'waymarked', 0, NULL)
GO
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09', N'gps', 0, N'Loss of GPS signal in tunnels is of no account - there''s only one path.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09', N'riverbed', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09', N'scenic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09', N'slippery', 0, N'Tunnels will be wet and slippery.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09', N'starred', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09', N'vertigo', 0, N'Some risk along high gallery path.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09', N'views', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09a', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09a', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09a', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09b', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09b', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09b', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09b', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09c', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09c', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09c', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'09c', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10', N'coastal', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10', N'dragon', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10', N'slippery', 0, N'Loose material on barranco descents.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10', N'vertigo', 0, N'Mild exposure along the cliffs.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10', N'views', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10a', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10a', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10a', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10b', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10b', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10b', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10b', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'10b', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11', N'coastal', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11', N'long', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11', N'slippery', 1, N'Loose material on barranco paths')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11', N'starred', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11', N'steep', 1, N'Big barrancos - may be tough on the knees')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11', N'vertigo', 0, N'Open coastal paths entering the barrancos')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11', N'views', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11a', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11a', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11a', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11b', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11b', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11b', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'11b', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'archeological', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'coastal', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'gps', 0, N'Signal is weak or lost in the barranco.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'hard', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'laurisilva', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'long', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'pine', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'poi', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'scenic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'slippery', 0, N'Cobbles, clay paths, mud and loose material in places.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'steep', 0, N'The climb is not too bad but it''s tiring in a long walk.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12a', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12a', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'12a', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'archeological', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'coastal', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'pine', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'poi', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'port', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'starred', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'steep', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'vertigo', 0, N'Brief and slight vertigo risk when rounding the headland to get to the port.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'views', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13a', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13a', N'linear', 0, NULL)
GO
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13a', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13b', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13b', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13b', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13b', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'13b', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'14', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'14', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'14', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'14', N'coastal', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'14', N'dragon', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'14', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'14', N'scenic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'14', N'slippery', 1, N'Cobbled path can be very slippery when wet')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'14', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'15', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'15', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'15', N'archeological', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'15', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'15', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'15', N'gps', 1, N'Signal will be reduced or lost in the barranco.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'15', N'laurisilva', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'15', N'poi', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'15', N'slippery', 1, N'Muddy and cobbled sections on the descent are slippery when wet.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'15', N'starred', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'15', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16', N'archeological', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16', N'coastal', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16', N'gps', 1, N'Signal will be reduced or lost in the barranco.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16', N'laurisilva', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16', N'poi', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16', N'scenic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16', N'slippery', 1, N'Muddy and cobbled sections on the descent are slippery when wet.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16', N'views', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16a', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16a', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16a', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16b', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16b', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16b', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'16b', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17', N'coastal', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17', N'dragon', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17', N'poi', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17', N'scenic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17', N'views', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17a', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17a', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'17a', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'18', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'18', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'18', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'18', N'coastal', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'18', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'18', N'port', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'18', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'18', N'vertigo', 0, N'Minimal risk.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'18', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'archeological', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'dragon', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'gps', 0, N'Signal is likely to be lost in the barranco but as there is but one path...')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'pine', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'poi', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'rockfall', 0, N'Slight chance of rockfall in the barranco.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'slippery', 0, N'Sections of the barranco descent have loose material.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'starred', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'steep', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'vertigo', 1, N'The descent into the barranco could be dizzying for some.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19', N'views', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19a', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19a', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19a', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19b', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19b', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19b', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19b', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'19b', N'moderate', 0, NULL)
GO
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'20', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'20', N'coastal', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'20', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'20', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'20', N'rockfall', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'20', N'scenic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'20', N'slippery', 0, N'Cobbled sections can be slippery when wet.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'20', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'20', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'20a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'20a', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'20a', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'20a', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21', N'coastal', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21', N'poi', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21', N'port', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21', N'slippery', 1, N'Descent to Playa Jurdando is tricky. The walk in reverse would make it easier.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21', N'starred', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21', N'vertigo', 1, N'Descent to Playa Jurdando on the cliff edge highly likely to cause problems.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21', N'views', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21a', N'hard', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21a', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21a', N'long', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21b', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21b', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21b', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'21b', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22', N'pine', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22', N'steep', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22', N'views', 1, N'The 23b variant path has the best views.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22', N'weather', 1, N'The 23b variant path goes close the the barranco edge so avoid in poor weather.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22a', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22a', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22a', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22b', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22b', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22b', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'22b', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23', N'coastal', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23', N'poi', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23', N'riverbed', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23', N'scenic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23', N'steep', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23', N'vertigo', 0, N'Although perfectly safe, the point where the cliff path rounds the headland may cause brief vertigo.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23', N'views', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23a', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23a', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23a', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23b', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23b', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23b', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'23b', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.1', N'archeological', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.1', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.1', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.1', N'mountain', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.1', N'peaks', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.1', N'poi', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.1', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.1', N'slippery', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.1', N'starred', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.1', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.1', N'vertigo', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.1', N'views', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.1', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.1', N'weather', 1, N'Expect strong winds and cold. Avoid in poor weather.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.2', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.2', N'laurisilva', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.2', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.2', N'mountain', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.2', N'peaks', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.2', N'pine', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.2', N'poi', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.2', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.2', N'slippery', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.2', N'starred', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.2', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.2', N'views', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.2', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24.2', N'weather', 1, N'Expect strong winds and cold. Avoid in poor weather.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24a', N'accessCar', 0, NULL)
GO
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24a', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24a', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24a', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24b', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24b', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24b', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24b', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24c', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24c', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24c', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24c', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24d', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24d', N'long', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'24d', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'25', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'25', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'25', N'mountain', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'25', N'peaks', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'25', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'25', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'25', N'slippery', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'25', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'25', N'vertigo', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'25', N'views', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'25', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'25', N'weather', 1, N'Expect strong winds and cold. Avoid in poor weather.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26', N'long', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26', N'pine', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26', N'poi', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26', N'riverbed', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26', N'starred', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26', N'views', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26', N'weather', 1, N'The park will be closed in bad weather or if bad weather is expected.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26a', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26a', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26a', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26b', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26b', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'26b', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27', N'peaks', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27', N'pine', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27', N'poi', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27', N'vertigo', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27', N'views', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27a', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27a', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27a', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27b', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27b', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27b', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27c', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27c', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27c', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27c', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27d', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27d', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'27d', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28', N'gps', 0, N'Variant descents are on unmarked paths.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28', N'peaks', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28', N'pine', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28', N'starred', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28', N'vertigo', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28', N'views', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28a', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28a', N'long', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28a', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28b', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28b', N'long', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'28b', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'29', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'29', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'29', N'gps', 0, N'The country lanes are unmarked and would be hard to navigate without GPS.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'29', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'29', N'pine', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'29', N'scenic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'29', N'steep', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'29', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'29', N'volcanic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'30', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'30', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'30', N'laurisilva', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'30', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'30', N'pine', 0, NULL)
GO
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'30', N'slippery', 1, N'Cobbled sections are rather treacherous when wet.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'30', N'steep', 1, N'The climb up to the Cumbra Nueva is a long staircase, hard on the knees.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'30', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'30', N'views', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'30', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31', N'pine', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31', N'scenic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31', N'steep', 1, N'The climb up to the Cumbra Nueva is a long staircase, hard on the knees.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31', N'views', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31', N'volcanic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31', N'weather', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31a', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31a', N'return', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'31a', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'32', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'32', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'32', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'32', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'32', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'32', N'pine', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'32', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'32', N'slippery', 0, N'The first part of the walk is prone to erosion')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'32', N'starred', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'32', N'volcanic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'32', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33', N'gps', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33', N'peaks', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33', N'pine', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33', N'scenic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33', N'slippery', 1, N'Scree slope to negotiate, more had work than falling risk')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33', N'vertigo', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33', N'volcanic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33', N'weather', 0, N'Careful on the peak in high winds or poor visibility')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33a', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33a', N'long', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'33a', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34', N'hard', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34', N'long', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34', N'peaks', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34', N'starred', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34', N'vertigo', 0, N'Vertigo is only likely to be an issue if you climb the peaks')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34', N'volcanic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34', N'waymarked', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34', N'weather', 0, N'Avoid the route in strong winds or poor visibility')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34a', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34a', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34a', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34b', N'hard', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34b', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'34b', N'long', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'35', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'35', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'35', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'35', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'35', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'35', N'peaks', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'35', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'35', N'slippery', 1, N'Some loose material when descending steep paths off the volcanos.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'35', N'vertigo', 1, N'Pico Birigoyo ascent is very exposed and vertigo inducing')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'35', N'volcanic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'35', N'weather', 1, N'Strong winds are a major hazard climbing Pico Birigoyo')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'36', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'36', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'36', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'36', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'36', N'peaks', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'36', N'scenic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'36', N'vertigo', 1, N'The ascent up Volcán de Martín is exposed.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'36', N'volcanic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'36', N'weather', 0, N'Avoid climbing Volcán de Martín in high winds or poor visibility.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'36a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'36a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'36a', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'36a', N'full', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'36a', N'strenuous', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37', N'easy', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37', N'peaks', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37', N'poi', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37', N'scenic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37', N'stroll', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37', N'vertigo', 1, N'Although protected, Volcán San Antonio is a moderate vertigo risk.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37', N'volcanic', 1, NULL)
GO
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37', N'weather', 0, N'Volcán San Antonio rim should be avoided in strong winds or poor visibility')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37a', N'accessBus', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37a', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37a', N'circular', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37a', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'37a', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'38', N'accessCar', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'38', N'half', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'38', N'linear', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'38', N'moderate', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'38', N'peaks', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'38', N'poi', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'38', N'port', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'38', N'scenic', 0, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'38', N'steep', 1, N'Some scrambling needed when ascending Volcán Teneguía')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'38', N'vertigo', 1, N'Volcán Teneguía is a moderate vertigo risk and unsafe in high winds.')
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'38', N'volcanic', 1, NULL)
INSERT [dbo].[route_category] ([id], [feature], [is_strong], [notes]) VALUES (N'38', N'weather', 0, N'Volcán Teneguía should be avoided in strong winds or poor visibility')
GO
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'01', N'28')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'02', N'27')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'03', N'26')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'04', N'24')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'04', N'25')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'07', N'30')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'12', N'22')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'13', N'23')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'15', N'22')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'16', N'22')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'17', N'21')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'19', N'16')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'19', N'17')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'19', N'18')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'19', N'19')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'19', N'20')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'21', N'15')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'22', N'14')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'23', N'13')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'24.1', N'10')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'24.1', N'11')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'24.1', N'12')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'24.2', N'06')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'24.2', N'12')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'25', N'10')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'25', N'11')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'26', N'08')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'26', N'09')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'26', N'29')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'27', N'07')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'34', N'05')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'35', N'05')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'37', N'02')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'38', N'02')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'38', N'03')
INSERT [dbo].[route_poi] ([route_id], [poi_id]) VALUES (N'38', N'04')
GO
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'01', N'PR LP 01')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'01', N'PR LP 02.2')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'02', N'PR LP 02')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'03', N'PR LP 19')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'04', N'PR LP 02.3')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'05', N'GR 130 Etapa 1')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'06', N'PR LP 05')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'06', N'PR LP 05.1')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'08', N'GR 130 Etapa 2')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'08', N'PR LP 07')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'08', N'PR LP 07.1')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'09', N'PR LP 06')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'10', N'GR 130 Etapa 3')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'10', N'SL BL 41')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'11', N'GR 130 Etapa 3')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'12', N'GR 130 Etapa 3')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'12', N'PR LP 09')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'12', N'PR LP 09.2')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'13', N'PR LP 09')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'13', N'PR LP 09.3')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'13', N'SL VG 51')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'14', N'PR LP 09')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'14', N'PR LP 09.3')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'15', N'PR LP 09')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'15', N'PR LP 09.2')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'16', N'PR LP 09.2')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'17', N'GR 130 Etapa 4')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'17', N'PR LP 11.1')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'18', N'PR LP 11.2')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'19', N'GR 130 Etapa 4')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'19', N'PR LP 11.1')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'20', N'GR 130 Etapa 5')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'21', N'PR LP 12.2')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'22', N'GR 130 Etapa 5')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'22', N'GR 131 Etapa 1')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'22', N'PR LP 10')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'22', N'SL TJ 71')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'23', N'GR 130 Etapa 6')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'23', N'GR 131 Etapa 1')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'24.1', N'GR 131 Etapa 2')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'24.2', N'GR 131 Etapa 2')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'24.2', N'PR LP 01')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'24.2', N'PR LP 01.1')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'24.2', N'PR LP 13.3')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'25', N'GR 131 Etapa 1')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'26', N'PR LP 13')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'27', N'PR LP 01')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'27', N'PR LP 01.1')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'27', N'PR LP 13.3')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'28', N'PR LP 13.3')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'29', N'PR LP 14')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'29', N'SL EP 101')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'30', N'PR LP 01')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'31', N'GR 131 Etapa 2')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'31', N'PR LP 01')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'31', N'PR LP 01.1')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'31', N'PR LP 13.3')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'31', N'PR LP 14')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'32', N'PR LP 14.1')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'32', N'SL EP 107')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'33', N'PR LP 15')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'34', N'GR 131 Etapa 3')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'35', N'GR 131 Etapa 3')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'35', N'PR LP 16')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'35', N'SL VM 125')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'36', N'GR 131 Etapa 3')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'36', N'SL FU 110')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'36', N'SL FU 111')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'37', N'GR 131 Etapa 3')
INSERT [dbo].[route_trail] ([route_id], [trail_id]) VALUES (N'38', N'GR 131 Etapa 3')
GO
INSERT [dbo].[tag] ([tag], [description]) VALUES (N'archeology', N'Petroglyphs etc.')
INSERT [dbo].[tag] ([tag], [description]) VALUES (N'building', N'Archetecturally significant')
INSERT [dbo].[tag] ([tag], [description]) VALUES (N'camping', N'Campsite or hiker hut')
INSERT [dbo].[tag] ([tag], [description]) VALUES (N'info', N'Information point')
INSERT [dbo].[tag] ([tag], [description]) VALUES (N'museum', N'Museum or visitor centre')
INSERT [dbo].[tag] ([tag], [description]) VALUES (N'nature', N'Natural wonder')
INSERT [dbo].[tag] ([tag], [description]) VALUES (N'recreation', N'Picnic sites, play areas etc.')
INSERT [dbo].[tag] ([tag], [description]) VALUES (N'refreshments', N'Serves food and/or drink')
INSERT [dbo].[tag] ([tag], [description]) VALUES (N'tourism', N'Other sites of tourist interest')
INSERT [dbo].[tag] ([tag], [description]) VALUES (N'transport', N'Transport hub or station')
GO
INSERT [dbo].[trail] ([trail_id]) VALUES (N'GR 130 Etapa 1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'GR 130 Etapa 2')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'GR 130 Etapa 3')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'GR 130 Etapa 4')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'GR 130 Etapa 5')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'GR 130 Etapa 6')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'GR 130 Etapa 7')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'GR 130 Etapa 8')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'GR 131 Etapa 1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'GR 131 Etapa 2')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'GR 131 Etapa 3')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 01')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 01.1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 02')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 02.1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 02.2')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 02.3')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 03')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 03.1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 03.2')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 04')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 04.1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 05')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 05.1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 06')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 07')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 07.1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 08')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 09')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 09.1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 09.2')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 09.3')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 10')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 11')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 11.1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 11.2')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 12')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 12.1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 12.2')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 13')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 13.1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 13.3')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 14')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 14.1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 15')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 16')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 16.1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 17')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 18')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 18.1')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 18.2')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 19')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'PR LP 20')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL BB 131')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL BB 132')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL BL 40')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL BL 41')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL EP 100')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL EP 101')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL EP 103')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL EP 104')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL EP 105')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL EP 107')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL FU 110')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL FU 111')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL FU 112')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL PG 60')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL PG 61')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL PG 62')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL PG 63')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL PG 64')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL PL 20')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL SC 14')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL TJ 70')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL TJ 71')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL VG 51')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL VG 55')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL VM 122')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL VM 123')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL VM 124')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL VM 125')
INSERT [dbo].[trail] ([trail_id]) VALUES (N'SL VM 126')
GO
ALTER TABLE [dbo].[bus_route_bus_stop]  WITH CHECK ADD  CONSTRAINT [FK_BusrouteBusstops_Busroutes] FOREIGN KEY([route_number])
REFERENCES [dbo].[bus_route] ([route_number])
GO
ALTER TABLE [dbo].[bus_route_bus_stop] CHECK CONSTRAINT [FK_BusrouteBusstops_Busroutes]
GO
ALTER TABLE [dbo].[bus_route_bus_stop]  WITH CHECK ADD  CONSTRAINT [FK_BusrouteBusstops_Busstops] FOREIGN KEY([stop_name])
REFERENCES [dbo].[bus_stop] ([stop_name])
GO
ALTER TABLE [dbo].[bus_route_bus_stop] CHECK CONSTRAINT [FK_BusrouteBusstops_Busstops]
GO
ALTER TABLE [dbo].[category]  WITH CHECK ADD  CONSTRAINT [FK_category_category_type] FOREIGN KEY([type])
REFERENCES [dbo].[category_type] ([category_type])
GO
ALTER TABLE [dbo].[category] CHECK CONSTRAINT [FK_category_category_type]
GO
ALTER TABLE [dbo].[danger]  WITH CHECK ADD  CONSTRAINT [FK_danger_route] FOREIGN KEY([route_id])
REFERENCES [dbo].[route] ([id])
GO
ALTER TABLE [dbo].[danger] CHECK CONSTRAINT [FK_danger_route]
GO
ALTER TABLE [dbo].[image]  WITH CHECK ADD  CONSTRAINT [FK_image_route] FOREIGN KEY([id])
REFERENCES [dbo].[route] ([id])
GO
ALTER TABLE [dbo].[image] CHECK CONSTRAINT [FK_image_route]
GO
ALTER TABLE [dbo].[location]  WITH CHECK ADD  CONSTRAINT [FK_location_bus_stop] FOREIGN KEY([bus_stop])
REFERENCES [dbo].[bus_stop] ([stop_name])
GO
ALTER TABLE [dbo].[location] CHECK CONSTRAINT [FK_location_bus_stop]
GO
ALTER TABLE [dbo].[location_area]  WITH CHECK ADD  CONSTRAINT [FK_location_area_area] FOREIGN KEY([area_name])
REFERENCES [dbo].[area] ([area_name])
GO
ALTER TABLE [dbo].[location_area] CHECK CONSTRAINT [FK_location_area_area]
GO
ALTER TABLE [dbo].[location_area]  WITH CHECK ADD  CONSTRAINT [FK_location_area_location] FOREIGN KEY([location])
REFERENCES [dbo].[location] ([name])
GO
ALTER TABLE [dbo].[location_area] CHECK CONSTRAINT [FK_location_area_location]
GO
ALTER TABLE [dbo].[opening_time]  WITH CHECK ADD  CONSTRAINT [FK_opening_time_poi] FOREIGN KEY([poi_id])
REFERENCES [dbo].[poi] ([id])
GO
ALTER TABLE [dbo].[opening_time] CHECK CONSTRAINT [FK_opening_time_poi]
GO
ALTER TABLE [dbo].[poi]  WITH CHECK ADD  CONSTRAINT [FK_poi_location] FOREIGN KEY([location])
REFERENCES [dbo].[location] ([name])
GO
ALTER TABLE [dbo].[poi] CHECK CONSTRAINT [FK_poi_location]
GO
ALTER TABLE [dbo].[poi_image]  WITH CHECK ADD  CONSTRAINT [FK_poi_image_poi] FOREIGN KEY([id])
REFERENCES [dbo].[poi] ([id])
GO
ALTER TABLE [dbo].[poi_image] CHECK CONSTRAINT [FK_poi_image_poi]
GO
ALTER TABLE [dbo].[poi_tag]  WITH CHECK ADD  CONSTRAINT [FK_poi_tag_poi] FOREIGN KEY([poi_id])
REFERENCES [dbo].[poi] ([id])
GO
ALTER TABLE [dbo].[poi_tag] CHECK CONSTRAINT [FK_poi_tag_poi]
GO
ALTER TABLE [dbo].[poi_tag]  WITH CHECK ADD  CONSTRAINT [FK_poi_tag_tag] FOREIGN KEY([tag])
REFERENCES [dbo].[tag] ([tag])
GO
ALTER TABLE [dbo].[poi_tag] CHECK CONSTRAINT [FK_poi_tag_tag]
GO
ALTER TABLE [dbo].[route]  WITH CHECK ADD  CONSTRAINT [FK_Routes_LocationsFinish] FOREIGN KEY([finish])
REFERENCES [dbo].[location] ([name])
GO
ALTER TABLE [dbo].[route] CHECK CONSTRAINT [FK_Routes_LocationsFinish]
GO
ALTER TABLE [dbo].[route]  WITH CHECK ADD  CONSTRAINT [FK_Routes_LocationsStart] FOREIGN KEY([start])
REFERENCES [dbo].[location] ([name])
GO
ALTER TABLE [dbo].[route] CHECK CONSTRAINT [FK_Routes_LocationsStart]
GO
ALTER TABLE [dbo].[route_category]  WITH CHECK ADD  CONSTRAINT [FK_route_category_category] FOREIGN KEY([feature])
REFERENCES [dbo].[category] ([name])
GO
ALTER TABLE [dbo].[route_category] CHECK CONSTRAINT [FK_route_category_category]
GO
ALTER TABLE [dbo].[route_category]  WITH CHECK ADD  CONSTRAINT [FK_route_category_route] FOREIGN KEY([id])
REFERENCES [dbo].[route] ([id])
GO
ALTER TABLE [dbo].[route_category] CHECK CONSTRAINT [FK_route_category_route]
GO
ALTER TABLE [dbo].[route_poi]  WITH CHECK ADD  CONSTRAINT [FK_route_poi_poi] FOREIGN KEY([poi_id])
REFERENCES [dbo].[poi] ([id])
GO
ALTER TABLE [dbo].[route_poi] CHECK CONSTRAINT [FK_route_poi_poi]
GO
ALTER TABLE [dbo].[route_poi]  WITH CHECK ADD  CONSTRAINT [FK_route_poi_route] FOREIGN KEY([route_id])
REFERENCES [dbo].[route] ([id])
GO
ALTER TABLE [dbo].[route_poi] CHECK CONSTRAINT [FK_route_poi_route]
GO
ALTER TABLE [dbo].[route_trail]  WITH CHECK ADD  CONSTRAINT [FK_RoutesTrails_Routes] FOREIGN KEY([route_id])
REFERENCES [dbo].[route] ([id])
GO
ALTER TABLE [dbo].[route_trail] CHECK CONSTRAINT [FK_RoutesTrails_Routes]
GO
ALTER TABLE [dbo].[route_trail]  WITH CHECK ADD  CONSTRAINT [FK_RoutesTrails_Trails] FOREIGN KEY([trail_id])
REFERENCES [dbo].[trail] ([trail_id])
GO
ALTER TABLE [dbo].[route_trail] CHECK CONSTRAINT [FK_RoutesTrails_Trails]
GO
/****** Object:  StoredProcedure [dbo].[category_to_json]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Robert Anstey
-- Create date: 06/08/2022
-- Description:	Outputs category definitions
-- =============================================
CREATE PROCEDURE [dbo].[category_to_json]
	@jsonOutput NVARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SET @jsonOutput = (
		SELECT c.name,
			   c.type,
			   c.label,
			   ISNULL(c.description, c.label) AS description,
			   c.icon,
			   ISNULL(c.filter_exclude_text, '') AS exclude_text,
			   ISNULL(c.filter_include_text, '') AS include_text,
			   c.strong AS strong_tag
		  FROM category AS c
		FOR JSON PATH)
END
GO
/****** Object:  StoredProcedure [dbo].[lapalmadata_to_json]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



-- =============================================
-- Author:		Robert Anstey
-- Create date: 17/08/2020
-- Description:	Combines sub procedure output into one JSON file
-- =============================================
CREATE PROCEDURE [dbo].[lapalmadata_to_json]
	@jsonOutput NVARCHAR(MAX) OUTPUT

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @RC1 INT
	DECLARE @jsonOutput1 NVARCHAR(MAX)

	DECLARE @RC2 INT
	DECLARE @jsonOutput2 NVARCHAR(MAX)

	DECLARE @RC3 INT
	DECLARE @jsonOutput3 NVARCHAR(MAX)

	DECLARE @RC4 INT
	DECLARE @jsonOutput4 NVARCHAR(MAX)

	DECLARE @RC5 INT
	DECLARE @jsonOutput5 NVARCHAR(MAX)

	EXECUTE @RC1 = [dbo].[category_to_json]
	   @jsonOutput1 OUTPUT

	EXECUTE @RC2 = [dbo].[tag_to_json]
	   @jsonOutput2 OUTPUT

	EXECUTE @RC3 = [dbo].[location_to_json]
		@jsonOutput3 OUTPUT

	EXECUTE @RC4 = [dbo].[poi_to_json]
		@jsonOutput4 OUTPUT

	EXECUTE @RC5 = [dbo].[route_to_json]
		@jsonOutput5 OUTPUT

    -- Insert statements for procedure here
	SET @jsonOutput = (SELECT CONCAT(
		'{',
		'  "categories": ',		@jsonOutput1, 
		', "tags": ',			@jsonOutput2, 
		', "locations": ',		@jsonOutput3, 
		', "poi": ',			@jsonOutput4, 
		', "routes": ',			@jsonOutput5, 
		'}'))
END
GO
/****** Object:  StoredProcedure [dbo].[location_to_json]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Robert Anstey
-- Create date: 06/08/2022
-- Description:	La Palma location data
-- =============================================
CREATE PROCEDURE [dbo].[location_to_json]
	@jsonOutput NVARCHAR(MAX) OUTPUT

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SET @jsonOutput = (SELECT l.name,
		   FORMAT(l.longitude, 'N8') AS long,
		   FORMAT(l.latitude, 'N8') AS lat,
		   l.parking,
		   l.taxi,
		   l.bus_notes AS 'bus.notes',
		   l.bus_stop AS 'bus.stop',
		   (   SELECT STRING_AGG(ISNULL(bus_route_bus_stop.route_number, ' '), ', ')
				 FROM bus_route_bus_stop
				WHERE bus_route_bus_stop.stop_name = l.bus_stop) AS 'bus.routes',
		   l.notes,
		   (SELECT JSON_QUERY((   SELECT CONCAT('["', STRING_AGG(location_area.area_name, '","'), '"]')
									FROM location_area
								   WHERE location_area.location = l.name))) As areas
		FROM location AS l
	FOR JSON PATH)
END
GO
/****** Object:  StoredProcedure [dbo].[poi_to_json]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



-- =============================================
-- Author:		Robert Anstey
-- Create date: 05/08/2022
-- Description:	Outputs a JSON format for POI data
-- =============================================
CREATE PROCEDURE [dbo].[poi_to_json] 
	@jsonOutput NVARCHAR(MAX) OUTPUT

AS
BEGIN
	SET NOCOUNT ON;

	SET @jsonOutput = (
		SELECT p.id,
			   p.short_name,
			   p.full_name,
			   p.description,
			   p.location,
			   p.location_description,
			   p.tel,
			   p.email,
			   p.entry_cost,
			   p.web_name,
			   p.web_address,

			   -- images
			   (   SELECT pi.pic_id
					 FROM poi_image AS pi
					WHERE pi.id           = p.id
					  AND pi.is_thumbnail = 1) AS 'thumbnail.file_name',
			   (   SELECT pi.width
					 FROM poi_image AS pi
					WHERE pi.id           = p.id
					  AND pi.is_thumbnail = 1) AS 'thumbnail.width',
			   (   SELECT pi.height
					 FROM poi_image AS pi
					WHERE pi.id           = p.id
					  AND pi.is_thumbnail = 1) AS 'thumbnail.height',
			   (   SELECT pi.pic_id
					 FROM poi_image AS pi
					WHERE pi.id           = p.id
					  AND pi.is_thumbnail = 0) AS 'main_image.file_name',
			   (   SELECT pi.width
					 FROM poi_image AS pi
					WHERE pi.id           = p.id
					  AND pi.is_thumbnail = 0) AS 'main_image.width',
			   (   SELECT pi.height
					 FROM poi_image AS pi
					WHERE pi.id           = p.id
					  AND pi.is_thumbnail = 0) AS 'main_image.height',

			   -- opening times
			   (   SELECT opening_time.time_period,
						  opening_time.[hours]
					 FROM opening_time
					WHERE opening_time.poi_id = p.id
				   FOR JSON PATH) AS opening_times,

				-- tags as array of strings
			   (SELECT JSON_QUERY((   SELECT CONCAT('["', STRING_AGG(poi_tag.tag, '","'), '"]')
										FROM poi_tag
									   WHERE poi_tag.poi_id = p.id))) As tags,
        
				-- related walks as array of strings
			   (SELECT JSON_QUERY((   SELECT CONCAT('["', STRING_AGG(RTRIM(route_poi.route_id), '","'), '"]')
										FROM route_poi
									   WHERE route_poi.poi_id = p.id))) As related_walks
		  FROM poi AS p
		 ORDER BY p.short_name
		FOR JSON PATH)
END
GO
/****** Object:  StoredProcedure [dbo].[route_to_json]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO






-- =============================================
-- Author:		Robert Anstey
-- Create date: 06/08/2022
-- Description:	Returns La Palma walking routes data
-- =============================================
CREATE PROCEDURE [dbo].[route_to_json]
	@jsonOutput NVARCHAR(MAX) OUTPUT

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SET @jsonOutput = (
		SELECT r.id,
		   r.name,
		   r.short_description,
		   r.description,
		   r.start AS start_name,
		   r.finish AS finish_name,
		   CONVERT(DECIMAL(5, 1), r.length_km) as length_km,
		   CONVERT(DECIMAL(5, 1), r.length_km / 1.609) as length_miles,
		   FORMAT(CAST(r.walking_time AS TIME), N'h\:mm') as walking_time,
		   r.refreshments,
		   r.route_file,

		   -- thumbnail image
		   (SELECT i.pic_id FROM image AS i WHERE i.id = r.id AND i.is_thumbnail = 1) AS 'thumbnail.file_name',
		   (SELECT i.width FROM image AS i WHERE i.id = r.id AND i.is_thumbnail = 1) AS 'thumbnail.width',
		   (SELECT i.height FROM image AS i WHERE i.id = r.id AND i.is_thumbnail = 1) AS 'thumbnail.height',

		   -- additional images
		   (   SELECT i.pic_id AS file_name,
					  i.width,
					  i.height,
					  i.caption
				 FROM image AS i
				WHERE i.id           = r.id
				  AND i.is_thumbnail = 0
			   FOR JSON PATH) AS images,

		   -- trail names as array of strings
		   (SELECT JSON_QUERY((   SELECT CONCAT('["', STRING_AGG(route_trail.trail_id, '","'), '"]')
									FROM route_trail
								   WHERE route_trail.route_id = r.id))) As trails,

		   -- dangers
		   (   SELECT d.danger,
					  d.description AS details,
					  d.is_strong
				 FROM danger AS d
				WHERE d.route_id = r.id
			   FOR JSON PATH) AS dangers,

		   -- POI
		   (   SELECT p.id,
					  p.short_name
				 FROM route_poi AS rp
				 JOIN poi AS p
				   ON rp.poi_id = p.id
				WHERE rp.route_id = r.id
			   FOR JSON PATH) as poi,

		   -- inner array of variants
		   (   SELECT v.id,
					  v.name,
					  v.description,
					  CAST((   SELECT 1
								 FROM route_category
								WHERE route_category.id      = r.id
								  AND route_category.feature = 'accessBus') AS BIT) as accessBus,
					  CAST((   SELECT 1
								 FROM route_category
								WHERE route_category.id      = r.id
								  AND route_category.feature = 'accessCar') AS BIT) as accessCar,
					  (   SELECT rc.feature
							FROM route_category AS rc
							JOIN route AS r ON r.id = rc.id
							JOIN category as c
							  ON c.name = rc.feature
						   WHERE v.id = r.id
							 AND c.type = 'walkType') as walk_type,					  
					  (   SELECT rc.feature
							FROM route_category AS rc
							JOIN route AS r ON r.id = rc.id
							JOIN category as c
							  ON c.name = rc.feature
						   WHERE v.id = r.id
							 AND c.type = 'duration') as duration,					  
					  (   SELECT rc.feature
							FROM route_category AS rc
							JOIN route AS r ON r.id = rc.id
							JOIN category as c
							  ON c.name = rc.feature
						   WHERE v.id = r.id
							 AND c.type = 'effort') as effort,					  
					  v.route_file,
					  v.start AS start_name,
					  v.finish AS finish_name,
					  v.directions
				 FROM route AS v
				WHERE v.variant_of = r.id
			   FOR JSON PATH) AS variants,

		   -- inner list of attributes
		   (   SELECT c.type,
					  rc.feature AS feature_name,
                      c.label,
					  rc.is_strong,
                      COALESCE(rc.notes, c.description) AS description,
                      c.icon,
					  c.strong AS strong_tag
				 FROM route_category AS rc
				 JOIN category AS c
				   ON c.name = rc.feature
				WHERE rc.id = r.id
				ORDER BY c.type,
						 rc.feature
			   FOR JSON PATH) AS attributes,

			-- inner list declaring whether there are any variants with the listed attribute or not
		   (   SELECT CAST(COUNT(1) AS BIT)
				 FROM route_category
				 JOIN route
				   ON route.id = route_category.id
				WHERE route.variant_of       = r.id
				  AND route_category.feature = 'circular') AS 'any_variant.circular',
		   (   SELECT CAST(COUNT(1) AS BIT)
				 FROM route_category
				 JOIN route
				   ON route.id = route_category.id
				WHERE route.variant_of       = r.id
				  AND route_category.feature = 'accessCar') AS 'any_variant.accessCar',
		   (   SELECT CAST(COUNT(1) AS BIT)
				 FROM route_category
				 JOIN route
				   ON route.id = route_category.id
				WHERE route.variant_of       = r.id
				  AND route_category.feature = 'accessBus') AS 'any_variant.accessBus',
		   (   SELECT CAST(COUNT(1) AS BIT)
				 FROM route_category
				 JOIN route
				   ON route.id = route_category.id
				WHERE route.variant_of           = r.id
				  AND (   route_category.feature = 'stroll'
					 OR   route_category.feature = 'half')) AS 'any_variant.short'
	  FROM route AS r
	 WHERE r.variant_of IS NULL
	FOR JSON PATH)
END
GO
/****** Object:  StoredProcedure [dbo].[tag_to_json]    Script Date: 07/09/2022 16:23:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Robert Anstey
-- Create date: 09/08/2022
-- Description:	Lists POI tags and descriptions
-- =============================================
CREATE PROCEDURE [dbo].[tag_to_json] 
	@jsonOutput NVARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    SET @jsonOutput = (
		SELECT
			t.tag,
			t.description
		FROM tag AS t
		FOR JSON PATH
	)	
END
GO
USE [master]
GO
ALTER DATABASE [LaPalmaForWalkers] SET  READ_WRITE 
GO
