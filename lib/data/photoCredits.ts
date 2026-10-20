/* Mahsulot fotosuratlari manbalari (Wikimedia Commons).
   CC BY / CC BY-SA litsenziyalari muallif va litsenziyani ko'rsatishni talab qiladi —
   ular /photo-credits sahifasida chiqadi. Rasm almashtirilsa, shu ro'yxatni ham yangilang. */

export interface PhotoCredit {
  article: string;
  product: string;
  file: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

export const PHOTO_CREDITS: PhotoCredit[] = [
  {
    "article": "BSH-GBH226",
    "product": "Перфоратор Bosch GBH 2-26 DRE, 800 Вт",
    "file": "Bosch GBH5-40 LargeDrill.jpg",
    "author": "KVDP",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:Bosch_GBH5-40_LargeDrill.jpg"
  },
  {
    "article": "MKT-DF333",
    "product": "Дрель-шуруповёрт Makita DF333DWAE, 12 В",
    "file": "Makita 18v electric drill (1).jpg",
    "author": "Helar Lukats",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Makita_18v_electric_drill_(1).jpg"
  },
  {
    "article": "STN-FM120",
    "product": "Уровень строительный Stanley FatMax, 120 см",
    "file": "Waterpass.jpg",
    "author": "Dmitry Makeev",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Waterpass.jpg"
  },
  {
    "article": "MKT-GA5030",
    "product": "Угловая шлифмашина Makita GA5030, 720 Вт",
    "file": "Makita GA9050 Angle Grinder (4887726714).jpg",
    "author": "Mark Hunter",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Makita_GA9050_Angle_Grinder_(4887726714).jpg"
  },
  {
    "article": "DWT-D25133K",
    "product": "Перфоратор DeWalt D25133K, 800 Вт",
    "file": "DeWalt D25103 unloaded.jpg",
    "author": "National Institute for Occupational Safety and Health",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:DeWalt_D25103_unloaded.jpg"
  },
  {
    "article": "MTB-BS18L",
    "product": "Шуруповёрт аккумуляторный Metabo BS 18 L, 18 В",
    "file": "Metabo Akku-Bohrschrauber BS 18 LTX BL Quick.jpg",
    "author": "Team Metabo OS",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Metabo_Akku-Bohrschrauber_BS_18_LTX_BL_Quick.jpg"
  },
  {
    "article": "KFT-HM500",
    "product": "Молоток слесарный Kraftool, 500 г",
    "file": "Claw-hammer.jpg",
    "author": "Evan-Amos",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:Claw-hammer.jpg"
  },
  {
    "article": "STN-SD6",
    "product": "Набор отвёрток Stanley, 6 шт.",
    "file": "Precision Screwdriver Set 2.jpg",
    "author": "oomlout",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Precision_Screwdriver_Set_2.jpg"
  },
  {
    "article": "KFT-SP450",
    "product": "Шпатель фасадный Kraftool, 450 мм",
    "file": "Putty Knife (8559730739).jpg",
    "author": "HomeSpot HQ",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Putty_Knife_(8559730739).jpg"
  },
  {
    "article": "KNF-ROT-30",
    "product": "Штукатурка гипсовая Knauf Ротбанд, 30 кг",
    "file": "Portland Type 1 paper bags of Taiwan Cement on Fu 2nd Street 20180501.jpg",
    "author": "Solomon203",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Portland_Type_1_paper_bags_of_Taiwan_Cement_on_Fu_2nd_Street_20180501.jpg"
  },
  {
    "article": "VLM-SL-30",
    "product": "Штукатурка гипсовая Волма Слой, 30 кг",
    "file": "Portland Cement Bags.jpg",
    "author": "KVDP",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:Portland_Cement_Bags.jpg"
  },
  {
    "article": "WBR-LRP-20",
    "product": "Шпаклёвка финишная Weber Vetonit LR+, 20 кг",
    "file": "NMCB 11 Community Relations in Rota, Spain (8429706).jpg",
    "author": "U.S. Navy photo by Petty Officer 2nd Class James Hong",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:NMCB_11_Community_Relations_in_Rota,_Spain_(8429706).jpg"
  },
  {
    "article": "CRS-CM11-25",
    "product": "Клей для плитки Ceresit CM 11 Plus, 25 кг",
    "file": "NMCB 11 Community Relations in Rota, Spain (8429704).jpg",
    "author": "U.S. Navy photo by Petty Officer 2nd Class James Hong",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:NMCB_11_Community_Relations_in_Rota,_Spain_(8429704).jpg"
  },
  {
    "article": "WBR-4310-20",
    "product": "Наливной пол Weber Vetonit 4310, 20 кг",
    "file": "Self-leveling concrete.jpg",
    "author": "Wonderlane from Seattle, USA",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Self-leveling_concrete.jpg"
  },
  {
    "article": "CRS-CT17-10",
    "product": "Грунтовка глубокого проникновения Ceresit CT 17, 10 л",
    "file": "435th AGOW Airmen blend resiliency with giving back (7883208).jpg",
    "author": "U.S. Air Force photo by Capt. Lou Burton",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:435th_AGOW_Airmen_blend_resiliency_with_giving_back_(7883208).jpg"
  },
  {
    "article": "KNF-GKL-125",
    "product": "Гипсокартон Knauf ГСП-А 12,5 мм, 2500×1200 мм",
    "file": "Drywall and tools.jpg",
    "author": "Timothyjosephwood",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Drywall_and_tools.jpg"
  },
  {
    "article": "GYP-H2-125",
    "product": "Гипсокартон влагостойкий Gyproc ГСП-H2 12,5 мм, 2500×1200 мм",
    "file": "Gib board aka plasterboard tapered edges 01.jpg",
    "author": "Panamitsu",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Gib_board_aka_plasterboard_tapered_edges_01.jpg"
  },
  {
    "article": "KNF-PP6027-3",
    "product": "Профиль потолочный Knauf ПП 60×27, 3 м",
    "file": "Metal stud framing for the engineering rooms located in the LIRR concourse area. (CM014B, 07-18-2018) (28645816477).jpg",
    "author": "MTA Capital Construction Mega Projects",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Metal_stud_framing_for_the_engineering_rooms_located_in_the_LIRR_concourse_area._(CM014B,_07-18-2018)_(28645816477).jpg"
  },
  {
    "article": "RW-LB-50",
    "product": "Утеплитель Rockwool Лайт Баттс, 50 мм (5,76 м²)",
    "file": "Arrangement Mineralwolle.jpeg",
    "author": "FMI Fachverband Mineralwolleindustrie",
    "license": "CC BY-SA 3.0 de",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/de/",
    "source": "https://commons.wikimedia.org/wiki/File:Arrangement_Mineralwolle.jpeg"
  },
  {
    "article": "URS-M11-50",
    "product": "Утеплитель Ursa Geo М-11, 50 мм (рулон 18 м²)",
    "file": "06 Thermal insulation retrofit works on a department store building with mineral wool and Aluthermo aluminium composite mat.jpg",
    "author": "Marek Ślusarczyk (Tupungato)",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "source": "https://commons.wikimedia.org/wiki/File:06_Thermal_insulation_retrofit_works_on_a_department_store_building_with_mineral_wool_and_Aluthermo_aluminium_composite_mat.jpg"
  },
  {
    "article": "TN-CE-50",
    "product": "Пенополистирол ТехноНИКОЛЬ Carbon Eco, 50 мм (8 плит)",
    "file": "Styrodur.jpg",
    "author": "U.S. Army Corps of Engineers Europe District",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:Styrodur.jpg"
  },
  {
    "article": "TN-SHG-K",
    "product": "Гибкая черепица ТехноНИКОЛЬ Shinglas Классик, 3 м²",
    "file": "Faster wear of asphalt shingles along eaves.JPG",
    "author": "Dale Mahalko",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Faster_wear_of_asphalt_shingles_along_eaves.JPG"
  },
  {
    "article": "TN-MEM-70",
    "product": "Мембрана гидроветрозащитная ТехноНИКОЛЬ, 70 м²",
    "file": "US Navy 100824-N-0858D-272 Sailors work on a new home for Habitat for Humanity during Boise Navy Week.jpg",
    "author": "U.S. Navy photo by Mass Communication Specialist 2nd Class Cheryl Dilgard",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:US_Navy_100824-N-0858D-272_Sailors_work_on_a_new_home_for_Habitat_for_Humanity_during_Boise_Navy_Week.jpg"
  },
  {
    "article": "TKR-EP7-9",
    "product": "Краска интерьерная Tikkurila Euro Power 7, 9 л",
    "file": "Paint bucket and brush.jpg",
    "author": "Ionenlaser",
    "license": "CC0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Paint_bucket_and_brush.jpg"
  },
  {
    "article": "CPR-AMP-10",
    "product": "Краска фасадная Caparol Amphibolin, 10 л",
    "file": "Plastsic pail of paint.jpg",
    "author": "Rlsheehan",
    "license": "CC0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Plastsic_pail_of_paint.jpg"
  },
  {
    "article": "DLX-BIN7-9",
    "product": "Краска для стен Dulux Professional Bindo 7, 9 л",
    "file": "Moscow, Durova Street, paving, bitumen buckets Sept 2025 02.jpg",
    "author": "Retired electrician",
    "license": "CC0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Moscow,_Durova_Street,_paving,_bitumen_buckets_Sept_2025_02.jpg"
  },
  {
    "article": "TKR-MIR-09",
    "product": "Эмаль алкидная Tikkurila Miranol, 0,9 л",
    "file": "Open Soy Paint Can (10481948313).jpg",
    "author": "United Soybean Board",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Open_Soy_Paint_Can_(10481948313).jpg"
  },
  {
    "article": "GRH-EUS-32",
    "product": "Смеситель для раковины Grohe Eurosmart",
    "file": "Bathroom Faucet.jpg",
    "author": "Stilfehler",
    "license": "CC0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Bathroom_Faucet.jpg"
  },
  {
    "article": "HG-LOG-BATH",
    "product": "Смеситель для ванны Hansgrohe Logis",
    "file": "Karmsund folkemuseum Haugesund Norway, bath room from the 1920s (DSC00378).jpg",
    "author": "Wolfmann",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Karmsund_folkemuseum_(Regional_Museum)_Haugesund_Norway_Interior_Baderom_fra_1920-%C3%A5ra_(Bath_room_from_the_1920s)_Badekar_kran_varmtvannstank_(bath_tub_toilet_seat)_etc_2020-06-10_DSC00378.jpg"
  },
  {
    "article": "RH-PPR20-2",
    "product": "Труба полипропиленовая Rehau PPR, 20 мм, 2 м",
    "file": "Haltern am See, Sythen, Werkzeughalle der Quarzwerke -- 2015 -- 4433.jpg",
    "author": "Dietmar Rabich",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Haltern_am_See,_Sythen,_Werkzeughalle_der_Quarzwerke_--_2015_--_4433.jpg"
  },
  {
    "article": "VT-BASE-12",
    "product": "Кран шаровой Valtec Base, 1/2\"",
    "file": "Ball valve in household.jpg",
    "author": "NVgt156",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Ball_valve_in_household.jpg"
  },
  {
    "article": "SE-ATN-SOC",
    "product": "Розетка Schneider Electric AtlasDesign с заземлением, белая",
    "file": "Small-outline Schuko socket module 02(DXO).jpg",
    "author": "Retired electrician",
    "license": "CC0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Small-outline_Schuko_socket_module_02(DXO).jpg"
  },
  {
    "article": "LG-DX3-C16",
    "product": "Автоматический выключатель Legrand DX³ C16, 1P",
    "file": "Circuit Breaker 3.png",
    "author": "MebaMCB China",
    "license": "CC0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Circuit_Breaker_3.png"
  },
  {
    "article": "FSH-SX840",
    "product": "Дюбель Fischer SX 8×40, 100 шт.",
    "file": "Circa 1980 Fischer S6 nylon expansion plugs 50106 made in Germany.jpg",
    "author": "R. Henrik Nilsson",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Circa_1980_Fischer_S6_nylon_expansion_plugs_50106_made_in_Germany.jpg"
  },
  {
    "article": "KFT-SMR-1000",
    "product": "Саморезы по гипсокартону Kraftool 3,5×25 мм, 1000 шт.",
    "file": "Drywall-screws-v1 (1).png",
    "author": "Nathan Eady",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:Drywall-screws-v1_(1).png"
  },
  {
    "article": "KM-SG6060-BT",
    "product": "Керамогранит Kerama Marazzi «Бетон» 60×60 см (1 м²)",
    "file": "6\"x6\" porcelain floor tiles.jpg",
    "author": "PJM",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "https://commons.wikimedia.org/wiki/File:6%22x6%22_porcelain_floor_tiles.jpg"
  },
  {
    "article": "KM-MAR-2050",
    "product": "Плитка настенная Kerama Marazzi «Мармион» 20×50 см (1 м²)",
    "file": "Marble Bathroom Maintenance.jpg",
    "author": "Tile Marble Granite",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Marble_Bathroom_Maintenance.jpg"
  }
];
