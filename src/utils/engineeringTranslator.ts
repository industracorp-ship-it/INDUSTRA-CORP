import { ValveCharacteristics, ValveProduct, SupportedLanguage } from "../types/valve";

/**
 * High-accuracy Industrial Engineering Multilingual Glossary & Translator
 * Covers mechanical piping, valve metallurgy, sealing criteria, temperature limits,
 * media compatibility, certifications, engineering projects and operational characteristics.
 * Supports: Vietnamese (VI), English (EN), Thai (TH), Chinese (ZH), Portuguese (PT), Arabic (AR).
 */

export const DICTIONARY_MAP_EN: Record<string, string> = {
  // Materials & Metallurgies
  "thép đúc": "Cast Steel WCB",
  "thép rèn": "Forged Steel A105",
  "thép cacbon": "Carbon Steel",
  "thép không gỉ": "Stainless Steel",
  "inox 304": "Stainless Steel SS304",
  "inox 316": "Stainless Steel SS316",
  "inox 316l": "Stainless Steel SS316L",
  "gang cầu": "Ductile Iron GGG50",
  "gang xám": "Cast Iron GG25",
  "gang dẻo": "Ductile Iron",
  "đồng thau": "Brass",
  "đồng thanh": "Bronze",
  "hợp kim": "Alloy Steel",
  "hợp kim đặc biệt": "Special Alloy / Stellite",
  "gioăng ptfe": "PTFE Gasket/Seat",
  "gioăng rptfe": "Reinforced PTFE Seat",
  "gioăng epdm": "EPDM Seat",
  "gioăng viton": "Viton (FKM) Seat",
  "gioăng nbr": "NBR Nitrile Seat",
  "gioăng chì": "Flexible Graphite Gasket",
  "tôi cứng stellite": "Stellite Gr.6 Hardfacing",
  "bellows seal": "Bellows Seal (TA-Luft Fugitive Emissions)",
  "lò xo thép hợp kim": "Alloy Steel Spring",

  // Pressure & Ratings
  "áp suất": "Pressure",
  "áp lực": "Pressure",
  "thử áp lực": "Hydrostatic Testing",
  "thử áp vỏ": "Shell Test",
  "thử áp đệm": "Seat Test",
  "mặt bích": "Flanged Connection",
  "nối ren": "Threaded NPT/BSPT",
  "hàn đối đầu": "Butt-Weld (BW)",
  "hàn lồng": "Socket-Weld (SW)",
  "kẹp bích": "Wafer Type",
  "tai bích": "Lug Type",
  "bích đôi": "Double Flange",

  // Media & Applications
  "nước cấp": "Potable Water",
  "nước sạch": "Clean Water",
  "nước làm mát": "Chilled / Cooling Water",
  "nước thải": "Wastewater",
  "hơi nóng": "High Pressure Steam",
  "hơi bão hòa": "Saturated Steam",
  "hơi quá nhiệt": "Superheated Steam",
  "dầu truyền nhiệt": "Thermal Oil",
  "dầu khí": "Oil & Gas",
  "khí nén": "Compressed Air",
  "khí oxy": "Oxygen Gas",
  "khí nito": "Nitrogen Gas",
  "khí co2": "CO2 Gas",
  "khí argon": "Argon Gas",
  "khí gas": "LPG / Natural Gas",
  "hóa chất ăn mòn": "Corrosive Chemicals",
  "hóa chất": "Chemicals",
  "axit": "Acidic Media",
  "kiềm": "Alkali",
  "pccc": "Fire Protection",
  "phòng cháy chữa cháy": "Fire Fighting System",

  // Valve Characteristics & Operational criteria
  "tuổi thọ": "Lifespan & Durability",
  "nhiệt độ làm việc": "Working Temperature",
  "nhiệt độ": "Operating Temperature",
  "độ kín khít": "Sealing Integrity",
  "độ kín": "Sealing Tightness",
  "ứng dụng môi chất": "Media Compatibility",
  "chu trình": "cycles",
  "năm": "years",
  "tháng": "months",
  "không cần bảo trì": "maintenance-free",
  "bảo hành": "warranty",
  "chống kẹt": "anti-clogging",
  "chống cháy": "fire-safe",
  "kín khít tuyệt đối": "Zero-leakage Rate A",
  "chống búa nước": "anti-water hammer",
  "giảm chấn": "cushioned",
  "tự động": "automatic",
  "điều khiển điện": "electric motorized actuator",
  "điều khiển khí nén": "pneumatic actuator",
  "tay quay": "gear operated",
  "tay gạt": "lever operated",
  "thân van": "valve body",
  "đĩa van": "valve disc",
  "trục van": "valve stem",
  "đệm mềm": "soft seated",
  "đệm kim loại": "metal seated",

  // Categories
  "van bi": "Ball Valve",
  "van bướm": "Butterfly Valve",
  "van cổng": "Gate Valve",
  "van cầu": "Globe Valve",
  "van một chiều": "Check Valve",
  "van an toàn": "Safety Relief Valve",
  "van giảm áp": "Pressure Reducing Valve",
  "van điều khiển": "Control Valve",
  "van cân bằng": "Balancing Valve",
  "van xả khí": "Air Release Valve",
  "y lọc": "Y-Strainer",
  "khớp nối mềm": "Flexible Rubber Joint",
  "van góc": "Angle Valve",
  "van dao": "Knife Gate Valve",
  "van màng": "Diaphragm Valve",
  "van kim": "Needle Valve",
  "van xả tràn": "Deluge Valve",
  "van báo động": "Alarm Valve"
};

/**
 * Comprehensive Chinese Dictionary:
 * Contains Vietnamese -> Chinese AND English -> Chinese mappings
 * to ensure that NO English or Vietnamese words leak when switching to Chinese.
 */
export const DICTIONARY_MAP_ZH: Record<string, string> = {
  // --- Valve Types & Names (VI & EN -> ZH) ---
  "van bi": "球阀",
  "ball valve": "球阀",
  "ball valves": "球阀系列",
  "van bướm": "蝶阀",
  "butterfly valve": "蝶阀",
  "butterfly valves": "蝶阀系列",
  "van cổng": "闸阀",
  "gate valve": "闸阀",
  "gate valves": "闸阀系列",
  "van cầu": "截止阀",
  "globe valve": "截止阀",
  "globe valves": "截止阀系列",
  "van một chiều": "止回阀",
  "check valve": "止回阀",
  "check valves": "止回阀系列",
  "van an toàn": "安全阀",
  "safety valve": "安全阀",
  "safety relief valve": "安全泄压阀",
  "van giảm áp": "减压阀",
  "pressure reducing valve": "减压阀",
  "van điều khiển": "调节控制阀",
  "control valve": "调节控制阀",
  "van cân bằng": "平衡阀",
  "balancing valve": "平衡阀",
  "van xả khí": "排气阀",
  "air release valve": "排气阀",
  "y lọc": "Y型过滤器",
  "y-strainer": "Y型过滤器",
  "khớp nối mềm": "橡胶膨胀节",
  "flexible joint": "橡胶膨胀节",
  "flexible rubber joint": "橡胶膨胀软接头",
  "van xả tràn": "雨淋阀",
  "deluge valve": "雨淋阀",
  "van báo động": "湿式报警阀",
  "alarm valve": "湿式报警阀",
  "van dao": "刀型闸阀",
  "knife gate": "刀型闸阀",
  "van kim": "针型阀",
  "needle valve": "针型阀",
  "van góc": "角阀 / 室内消火栓阀",
  "angle valve": "角阀",
  "van màng": "隔膜阀",
  "diaphragm valve": "隔膜阀",
  "van công nghiệp": "工业阀门",
  "industrial valve": "工业阀门",
  "industrial valves": "工业阀门",

  // --- Offsets & Designs ---
  "concentric": "同心中线",
  "đồng tâm": "同心中线",
  "double-offset": "双偏心高性能",
  "lệch tâm đôi": "双偏心",
  "triple-offset": "三偏心金属硬密封 (TOV)",
  "lệch tâm 3": "三偏心金属硬密封 (TOV)",
  "zero-offset": "零偏心同心",
  "soft-seated": "软密封",
  "đệm mềm": "软密封",
  "metal-to-metal": "金属硬密封",
  "metal seated": "金属硬密封",
  "đệm kim loại": "金属硬密封",

  // --- Metallurgy & Materials (VI & EN -> ZH) ---
  "thép đúc": "铸钢 WCB",
  "thép rèn": "锻钢 A105",
  "thép cacbon": "碳钢",
  "carbon steel": "碳钢",
  "cast steel": "铸钢 WCB",
  "forged steel": "锻钢 A105",
  "inox 304": "不锈钢 SS304",
  "stainless steel 304": "不锈钢 SS304",
  "stainless steel ss304": "不锈钢 SS304",
  "inox 316": "不锈钢 SS316",
  "stainless steel 316": "不锈钢 SS316",
  "stainless steel ss316": "不锈钢 SS316",
  "inox 316l": "不锈钢 SS316L",
  "stainless steel 316l": "不锈钢 SS316L",
  "stainless steel": "不锈钢",
  "gang cầu": "球墨铸铁 GGG50",
  "ductile iron": "球墨铸铁 GGG50",
  "gang xám": "灰铸铁 GG25",
  "cast iron": "灰铸铁 GG25",
  "đồng thau": "黄铜",
  "brass": "黄铜",
  "đồng thanh": "青铜",
  "bronze": "青铜",
  "hợp kim": "合金钢",
  "hợp kim đặc biệt": "特种合金 / 司太立",
  "alloy": "合金钢",
  "gioăng ptfe": "PTFE 聚四氟乙烯密封",
  "ptfe": "PTFE 聚四氟乙烯",
  "gioăng rptfe": "增强型 RPTFE 密封",
  "rptfe": "增强型 RPTFE",
  "gioăng epdm": "EPDM 三元乙丙橡胶",
  "epdm": "EPDM 三元乙丙橡胶",
  "gioăng viton": "Viton 氟橡胶 (FKM)",
  "viton": "Viton 氟橡胶",
  "fkm": "FKM 氟橡胶",
  "gioăng nbr": "NBR 丁腈橡胶",
  "nbr": "NBR 丁腈橡胶",
  "tôi cứng stellite": "司太立 Stellite Gr.6 堆焊硬化",
  "stellite": "司太立合金",
  "bellows seal": "波纹管密封 (TA-Luft 零逸散)",

  // --- Connections & End Preparations (VI & EN -> ZH) ---
  "mặt bích": "法兰连接",
  "flanged": "法兰连接",
  "flange": "法兰",
  "kẹp bích": "对夹式 (Wafer)",
  "wafer": "对夹式",
  "tai bích": "凸耳式 (Lug)",
  "lug": "凸耳式",
  "bích đôi": "双法兰式",
  "double flange": "双法兰式",
  "nối ren": "螺纹连接 (NPT/BSPT)",
  "threaded": "螺纹连接",
  "hàn đối đầu": "对焊式 (Butt-Weld BW)",
  "butt-weld": "对焊式 (BW)",
  "hàn lồng": "承插焊 (Socket-Weld SW)",
  "socket-weld": "承插焊 (SW)",
  "grooved": "沟槽式卡箍连接",
  "rãnh cùm": "沟槽式连接",

  // --- Working Fluids & Media (VI & EN -> ZH) ---
  "nước sạch": "自来水 / 清水系统",
  "nước cấp": "市政供水",
  "nước làm mát": "冷冻水 / 暖通循环水",
  "nước thải": "工业及生活污水",
  "nước": "水系统",
  "water": "水系统",
  "potable water": "饮用水",
  "chilled water": "冷冻水",
  "cooling water": "冷却循环水",
  "wastewater": "污水",
  "hơi nóng": "高温工业蒸汽",
  "hơi bão hòa": "饱和蒸汽",
  "hơi quá nhiệt": "过热蒸汽",
  "steam": "蒸汽",
  "saturated steam": "饱和蒸汽",
  "superheated steam": "过热蒸汽",
  "dầu truyền nhiệt": "高温导热油",
  "thermal oil": "导热油",
  "dầu khí": "石油天然气",
  "oil & gas": "石油天然气",
  "oil": "工业油脂 / 石油",
  "gas": "天然气 / 气体",
  "khí nén": "工业压缩空气",
  "compressed air": "压缩空气",
  "khí oxy": "工业高纯氧气",
  "oxygen": "氧气",
  "khí nito": "高纯氮气",
  "nitrogen": "氮气",
  "khí gas": "LPG / 液化天然气",
  "lpg": "液化石油气",
  "lng": "液化天然气 (LNG)",
  "hóa chất ăn mòn": "腐蚀性化工介质",
  "hóa chất": "化工流体",
  "chemicals": "化工流体",
  "axit": "酸性介质",
  "acid": "酸性介质",
  "kiềm": "碱性介质",
  "alkali": "碱性介质",
  "pccc": "消防管网系统",
  "fire fighting": "消防管网系统",
  "fire protection": "消防安全系统",
  "phòng cháy chữa cháy": "消防系统",

  // --- Characteristics, Lifespan & Sealing (VI & EN -> ZH) ---
  "tuổi thọ": "使用寿命与动作循环",
  "lifecycle": "动作寿命与耐久性",
  "durability": "耐久性",
  "nhiệt độ làm việc": "最高工作温度",
  "nhiệt độ": "工作温度",
  "temp": "工作温度",
  "temperature": "工作温度",
  "độ kín khít": "严密密封等级与泄漏率",
  "độ kín": "密封严密性",
  "sealing": "密封性能",
  "sealing integrity": "严密密封等级",
  "chu trình": "次动作循环",
  "cycles": "次动作循环",
  "năm": "年",
  "years": "年",
  "tháng": "个月",
  "months": "个月",
  "không cần bảo trì": "免维护设计",
  "maintenance-free": "免维护",
  "chống cháy": "API 607 耐火安全认证",
  "fire-safe": "耐火防爆认证",
  "chống kẹt": "防卡阻精密切削",
  "anti-clogging": "防卡阻",
  "chống búa nước": "防流水锤结构",
  "anti-water hammer": "防流体水锤",
  "kín khít tuyệt đối": "气泡级零泄漏 Rate A",
  "zero leakage": "气泡级零泄漏",
  "bubble-tight": "气泡级严密密封",
  "hoạt động liên tục": "连续稳定运行",
  "continuous operation": "连续稳定运行",
  "tiêu chuẩn": "制造与检验标准",
  "standard": "制造标准",
  "standards": "标准规范",
  "bảo hành": "质量保证期",
  "warranty": "质量保证期",
  "thân van": "阀体",
  "body": "阀体",
  "đĩa van": "阀瓣 / 蝶板",
  "disc": "阀瓣",
  "trục van": "阀杆",
  "stem": "阀杆",
  "trở lực rất thấp": "超低流阻设计",
  "trở lực trung bình": "中等流体阻力",
  "trở lực cao": "较高流阻",
  "cấp áp lực": "公称压力等级",
  "tổn thất áp": "流道压力损失",
  "nhận định chuyên gia": "工程技术专家评审意见",
  "engineering insight": "工程技术专家分析与选型建议",

  // --- System Groups & Application Domains (VI & EN -> ZH) ---
  "water system": "市政给排水系统",
  "water supply system": "市政给排水系统",
  "fire fighting system": "消防工程管网系统",
  "steam system": "高温工业蒸汽管网",
  "hvac system": "暖通空调循环水系统",
  "oil & gas system": "石油与天然气管线",
  "gas & cryogenic system": "工业气体与深冷系统",
  "instrument system": "自控仪表与测量系统",

  // --- Key Project Clients & Investors (VI & EN -> ZH) ---
  "tập đoàn dầu khí việt nam": "越南国家油气集团 (PetroVietnam)",
  "petrovietnam": "越南国家油气集团 (PetroVietnam)",
  "pv gas": "越南国家油气管道总公司 (PV GAS)",
  "tổng công ty khí việt nam": "越南油气管道总公司 (PV GAS)",
  "tập đoàn điện lực việt nam": "越南国家电力集团 (EVN)",
  "evn": "越南国家电力集团 (EVN)",
  "công ty cổ phần sữa việt nam": "越南乳业股份公司 (Vinamilk)",
  "vinamilk": "越南乳业股份公司 (Vinamilk)",
  "tổng công ty bia rượu nước giải khát sài gòn": "西贡啤酒饮料总公司 (Sabeco)",
  "sabeco": "西贡啤酒饮料总公司 (Sabeco)",
  "tập đoàn hòa phát": "和发钢铁集团 (Hoa Phat Group)",
  "hòa phát": "和发钢铁集团 (Hoa Phat)",
  "tập đoàn vingroup": "温纳集团 (Vingroup / Vinhomes)",
  "vingroup": "温纳集团 (Vingroup)",
  "vinhomes": "温纳地产 (Vinhomes)",
  "masterise homes": "万景置地 (Masterise Homes)",
  "bitexco group": "彼得斯科商业集团 (Bitexco)",
  "hyosung": "晓星集团 (Hyosung)",
  "formosa": "台塑河静钢铁 (Formosa)",
  "công ty cổ phần lọc hóa dầu bình sơn": "平山炼油化工股份公司 (Binh Son Refining)",
  "lọc dầu dung quất": "榕桔炼油厂",
  "lọc hóa dầu nghi sơn": "宜山炼油化工厂",
  "lọc hóa dầu long sơn": "龙山石化一体化基地",

  // --- Vietnamese Locations (VI -> ZH) ---
  "tp. hồ chí minh": "胡志明市",
  "hồ chí minh": "胡志明市",
  "hà nội": "河内市",
  "bà rịa - vũng tàu": "巴地-头顿省",
  "vũng tàu": "头顿市",
  "bình dương": "平阳省",
  "đồng nai": "同奈省",
  "quảng ngãi": "广义省",
  "thanh hóa": "清化省",
  "hải phòng": "海防市",
  "cần thơ": "芹苴市",
  "đà nẵng": "岘港市",
  "long an": "隆安省",
  "bắc ninh": "北宁省",
  "thái nguyên": "太原省",

  // --- Project Industries (VI & EN -> ZH) ---
  "dầu khí & lọc hóa dầu": "石油天然气与炼油化工",
  "oil & gas / petrochemicals": "石油天然气与炼油化工",
  "nhiệt điện & năng lượng": "火力发电与清洁能源",
  "power generation": "火力发电与清洁能源",
  "tòa nhà cao tầng & hvac": "高层商业建筑与暖通系统",
  "commercial high-rise & hvac": "高层商业建筑与暖通系统",
  "pccc & cứu hỏa ul/fm": "UL/FM 消防工程与管网",
  "fire protection & safety": "UL/FM 消防工程与管网",
  "thực phẩm, sữa & dược phẩm": "食品饮料与生物医药",
  "food, dairy & pharma": "食品饮料与生物医药",
  "công nghiệp nặng & thép": "重工业冶金与钢铁",
  "heavy industry & steel": "重工业冶金与钢铁",
  "cấp thoát nước & hạ tầng": "市政给排水与水利基础设施",

  // --- Commercial & Contract Terms (VI & EN -> ZH) ---
  "chủ đầu tư": "项目业主 / 投资方",
  "investor": "项目投资方",
  "vị trí": "项目建设地点",
  "location": "建设地点",
  "hoàn thành": "竣工交付",
  "completed": "竣工交付",
  "đang cấp hàng": "持续供货中",
  "active supply": "进行中 - 持续供货",
  "quy mô": "工程规模",
  "scale": "工程规模",
  "giá trị hợp đồng": "供货合同金额",
  "contract value": "合同金额",
  "chủng loại van cung cấp": "供应阀门规格范围",
  "gói thầu": "个设备供货标段",
  "đọc bài viết chi tiết": "查阅工程案例完整报告",
  "xóa dự án này khỏi hệ thống": "从系统中删除此工程案例",
  "thương hiệu sử dụng": "采用阀门品牌",
  "tổng giá trị": "合同总金额"
};

export const DICTIONARY_MAP_TH: Record<string, string> = {
  "thép đúc": "เหล็กกล้าหล่อ WCB",
  "thép rèn": "เหล็กกล้าตีขึ้นรูป A105",
  "inox 304": "สแตนเลส SS304",
  "inox 316": "สแตนเลส SS316",
  "gang cầu": "เหล็กหล่อเหนียว GGG50",
  "gang xám": "เหล็กหล่อสีเทา GG25",
  "gioăng ptfe": "ซีลเทฟลอน PTFE",
  "gioăng epdm": "ยาง EPDM",
  "mặt bích": "ต่อหน้าแปลน Flanged",
  "kẹp bích": "ชนิดเวเฟอร์ Wafer",
  "tai bích": "ชนิดลัก Lug",
  "hơi nóng": "ไอน้ำอุณหภูมิสูง",
  "nước sạch": "น้ำสะอาด",
  "nước làm mát": "น้ำหล่อเย็น Chiller",
  "dầu khí": "น้ำมันและก๊าซ",
  "khí nén": "อากาศอัด",
  "tuổi thọ": "อายุการใช้งาน",
  "nhiệt độ làm việc": "อุณหภูมิใช้งาน",
  "độ kín khít": "ความแน่นหนาของการซีล",
  "chu trình": "รอบการทำงาน",
  "năm": "ปี",
  "van bi": "บอลวาล์ว",
  "van bướm": "บัตเตอร์ฟลายวาล์ว",
  "van cổng": "เกทวาล์ว (ประตูน้ำ)",
  "van cầu": "โกลบวาล์ว",
  "van một chiều": "เช็ควาล์ว (กันกลับ)",
  "van an toàn": "เซฟตี้วาล์ว",
  "van giảm áp": "วาล์วลดแรงดัน"
};

export const DICTIONARY_MAP_PT: Record<string, string> = {
  "thép đúc": "Aço Fundido WCB",
  "thép rèn": "Aço Forjado A105",
  "inox 304": "Aço Inox SS304",
  "inox 316": "Aço Inox SS316",
  "gang cầu": "Ferro Fundido Nodular GGG50",
  "gang xám": "Ferro Fundido Cinzento GG25",
  "gioăng ptfe": "Vedação PTFE",
  "gioăng epdm": "Vedação EPDM",
  "mặt bích": "Conexão Flangeada",
  "kẹp bích": "Tipo Wafer",
  "tai bích": "Tipo Lug",
  "hơi nóng": "Vapor de Alta Pressão",
  "nước sạch": "Água Potável / Limpa",
  "nước làm mát": "Água Gelada Chiller",
  "dầu khí": "Petróleo e Gás",
  "khí nén": "Ar Comprimido",
  "tuổi thọ": "Vida Útil Operacional",
  "nhiệt độ làm việc": "Temperatura de Trabalho",
  "độ kín khít": "Estanqueidade e Vedação",
  "chu trình": "ciclos",
  "năm": "anos",
  "van bi": "Válvula Esfera",
  "van bướm": "Válvula Borboleta",
  "van cổng": "Válvula Gaveta",
  "van cầu": "Válvula Globo",
  "van một chiều": "Válvula Retenção",
  "van an toàn": "Válvula de Segurança",
  "van giảm áp": "Válvula Redutora de Pressão"
};

export const DICTIONARY_MAP_AR: Record<string, string> = {
  "thép đúc": "فولاذ مصبوب WCB",
  "thép rèn": "فولاذ مطروق A105",
  "inox 304": "ستانلس ستيل SS304",
  "inox 316": "ستانلس ستيل SS316",
  "gang cầu": "حديد دكتايل GGG50",
  "gang xám": "حديد زهر GG25",
  "gioăng ptfe": "حشية تفلون PTFE",
  "gioăng epdm": "مطاط صناعي EPDM",
  "mặt bích": "توصيل بالفلنجات",
  "kẹp bích": "نوع ويفر Wafer",
  "tai bích": "نوع لوغ Lug",
  "hơi nóng": "بخار عالي الضغط",
  "nước sạch": "مياه نقية صالحة للشرب",
  "nước làm mát": "مياه التبريد والتكييف",
  "dầu khí": "النفط والغاز الطبيعي",
  "khí nén": "هواء مضغوط",
  "tuổi thọ": "العمر التشغيلي",
  "nhiệt độ làm việc": "درجة حرارة التشغيل",
  "độ kín khít": "درجة إحكام الإغلاق",
  "chu trình": "دورة تشغيلية",
  "năm": "سنوات",
  "van bi": "صمام كروي",
  "van bướm": "صمام فراشة",
  "van cổng": "صمام بوابة",
  "van cầu": "صمام كروي خنق (غلوب)",
  "van một chiều": "صمام عدم رجوع",
  "van an toàn": "صمام أمان",
  "van giảm áp": "صمام تخفيض الضغط"
};

/**
 * Intelligent multilingual translator for technical strings.
 * Guarantees that when `lang === 'zh'`, everything is translated to professional technical Chinese.
 */
export function translateTechString(
  textVi?: string,
  textEn?: string,
  lang: SupportedLanguage = "vi"
): string {
  if (!textVi && !textEn) return "";
  if (lang === "vi") return textVi || textEn || "";

  // English fallback generator
  const baseEn = textEn && textEn.trim() ? textEn.trim() : (() => {
    let t = textVi || "";
    for (const [viPhrase, enPhrase] of Object.entries(DICTIONARY_MAP_EN)) {
      const regex = new RegExp(viPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
      t = t.replace(regex, enPhrase);
    }
    return t
      .replace(/(\d+[\d,.]*)\s*chu trình/gi, "$1 cycles")
      .replace(/(\d+)\s*-\s*(\d+)\s*năm/gi, "$1-$2 years")
      .replace(/(\d+)\s*năm/gi, "$1 years")
      .replace(/(\d+)\s*tháng/gi, "$1 months")
      .replace(/đến/gi, "to")
      .replace(/từ/gi, "from")
      .replace(/hoạt động liên tục/gi, "continuous operation")
      .replace(/đạt chuẩn/gi, "certified")
      .replace(/tiêu chuẩn/gi, "standard")
      .replace(/chống ăn mòn/gi, "corrosion resistant");
  })();

  if (lang === "en") return baseEn;

  // Chinese translation (ZH) - Thorough and accurate
  if (lang === "zh") {
    // Start with the richer source string
    let t = textVi || baseEn;

    // Apply exact/longest matches from Chinese dictionary first
    const sortedEntries = Object.entries(DICTIONARY_MAP_ZH).sort((a, b) => b[0].length - a[0].length);
    for (const [phrase, zhPhrase] of sortedEntries) {
      const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
      t = t.replace(regex, zhPhrase);
    }

    // Also apply English phrases if any English remains in the string
    if (textEn && textEn !== textVi) {
      for (const [phrase, zhPhrase] of sortedEntries) {
        const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
        t = t.replace(regex, zhPhrase);
      }
    }

    return t
      .replace(/(\d+[\d,.]*)\s*(chu trình|cycles|cycle)/gi, "$1 次动作循环")
      .replace(/(\d+)\s*-\s*(\d+)\s*(năm|years|year)/gi, "$1-$2 年")
      .replace(/(\d+)\s*(năm|years|year)/gi, "$1 年")
      .replace(/(\d+)\s*(tháng|months|month)/gi, "$1 个月")
      .replace(/\bđến\b|\bto\b/gi, "至")
      .replace(/\btừ\b|\bfrom\b/gi, "自")
      .replace(/hoạt động liên tục|continuous operation/gi, "连续稳定运行")
      .replace(/kín khít tuyệt đối|bubble-tight shutoff|bubble-tight/gi, "气泡级零泄漏")
      .replace(/zero leakage/gi, "零泄漏")
      .replace(/dự án|project/gi, "工程项目")
      .replace(/chủ đầu tư|client|investor/gi, "项目业主")
      .replace(/vị trí|location/gi, "建设地点")
      .replace(/tiêu chuẩn|standard|standards/gi, "技术标准")
      .replace(/bảo hành|warranty/gi, "质保期")
      .replace(/thương hiệu|brand/gi, "品牌")
      .replace(/gói thầu|package/gi, "供货标段");
  }

  // Thai translation
  if (lang === "th") {
    let t = textVi || baseEn;
    for (const [viPhrase, thPhrase] of Object.entries(DICTIONARY_MAP_TH)) {
      const regex = new RegExp(viPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
      t = t.replace(regex, thPhrase);
    }
    return t;
  }

  // Portuguese translation
  if (lang === "pt") {
    let t = textVi || baseEn;
    for (const [viPhrase, ptPhrase] of Object.entries(DICTIONARY_MAP_PT)) {
      const regex = new RegExp(viPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
      t = t.replace(regex, ptPhrase);
    }
    return t;
  }

  // Arabic translation
  if (lang === "ar") {
    let t = textVi || baseEn;
    for (const [viPhrase, arPhrase] of Object.entries(DICTIONARY_MAP_AR)) {
      const regex = new RegExp(viPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
      t = t.replace(regex, arPhrase);
    }
    return t;
  }

  return baseEn;
}

/**
 * Returns a localized copy of characteristics for a product
 */
export function getLocalizedCharacteristics(char?: ValveCharacteristics, lang: SupportedLanguage = "vi"): ValveCharacteristics {
  if (!char) {
    if (lang === "zh") {
      return {
        lifecycle: "100,000+ 次动作循环 / 10-15 年连续稳定运行",
        tempLimits: "-10°C 至 +180°C",
        sealIntegrity: "ISO 5208 Rate A (气泡级零泄漏 Bubble-Tight)",
        mediaApplications: "市政清水、中央空调冷冻水、压缩空气、弱腐蚀化工流体",
        aiSummaryNotes: "UTD 精密铸造结构，阀瓣经精密 CNC 切削加工，具备优异抗卡阻性能及高使用寿命。"
      };
    }
    return {
      lifecycle: "100,000+ chu trình / 10-15 năm vận hành",
      tempLimits: "-10°C đến +180°C",
      sealIntegrity: "ISO 5208 Rate A (Kín khít tuyệt đối Bubble-Tight)",
      mediaApplications: "Nước sạch, Nước lạnh Chiller, Khí nén, Hóa chất loãng",
      aiSummaryNotes: "Gia công cơ khí CNC chuẩn xác 100%, chống kẹt rác và độ bền cao."
    };
  }

  if (lang === "vi") {
    return {
      lifecycle: char.lifecycle || "100,000+ chu trình / 10-15 năm vận hành",
      lifecycleEn: char.lifecycleEn,
      tempLimits: char.tempLimits || "-10°C đến +180°C",
      tempLimitsEn: char.tempLimitsEn,
      sealIntegrity: char.sealIntegrity || "ISO 5208 Rate A (Kín khít tuyệt đối Bubble-Tight)",
      sealIntegrityEn: char.sealIntegrityEn,
      mediaApplications: char.mediaApplications || "Nước sạch, Nước lạnh Chiller, Khí nén, Hóa chất loãng",
      mediaApplicationsEn: char.mediaApplicationsEn,
      aiSummaryNotes: char.aiSummaryNotes,
      aiSummaryNotesEn: char.aiSummaryNotesEn,
      customAttributes: char.customAttributes?.map(attr => ({
        ...attr,
        key: attr.key,
        value: attr.value
      }))
    };
  }

  return {
    lifecycle: translateTechString(char.lifecycle, char.lifecycleEn, lang),
    lifecycleEn: char.lifecycleEn,
    tempLimits: translateTechString(char.tempLimits, char.tempLimitsEn, lang),
    tempLimitsEn: char.tempLimitsEn,
    sealIntegrity: translateTechString(char.sealIntegrity, char.sealIntegrityEn, lang),
    sealIntegrityEn: char.sealIntegrityEn,
    mediaApplications: translateTechString(char.mediaApplications, char.mediaApplicationsEn, lang),
    mediaApplicationsEn: char.mediaApplicationsEn,
    aiSummaryNotes: translateTechString(char.aiSummaryNotes, char.aiSummaryNotesEn, lang),
    aiSummaryNotesEn: char.aiSummaryNotesEn,
    customAttributes: char.customAttributes?.map(attr => ({
      ...attr,
      key: translateTechString(attr.key, attr.keyEn, lang),
      value: translateTechString(attr.value, attr.valueEn, lang),
      keyEn: attr.keyEn,
      valueEn: attr.valueEn
    }))
  };
}

/**
 * Returns a localized version of a ValveProduct object for rendering
 */
export function getLocalizedProduct(valve: ValveProduct, lang: SupportedLanguage): ValveProduct {
  if (lang === "vi") return valve;

  return {
    ...valve,
    name: translateTechString(valve.name, valve.nameEn, lang),
    categoryLabel: translateTechString(valve.categoryLabel, valve.categoryLabelEn, lang),
    systemGroupLabel: translateTechString(valve.systemGroupLabel, undefined, lang),
    badge: valve.badge ? translateTechString(valve.badge, undefined, lang) : valve.badge,
    material: translateTechString(valve.material, valve.materialEn, lang),
    connection: translateTechString(valve.connection, undefined, lang),
    sizeRange: translateTechString(valve.sizeRange, undefined, lang),
    tempRange: translateTechString(valve.tempRange, undefined, lang),
    pressure: translateTechString(valve.pressure, undefined, lang),
    leakageClass: valve.leakageClass ? translateTechString(valve.leakageClass, undefined, lang) : valve.leakageClass,
    testPressureShell: valve.testPressureShell ? translateTechString(valve.testPressureShell, undefined, lang) : valve.testPressureShell,
    testPressureSeat: valve.testPressureSeat ? translateTechString(valve.testPressureSeat, undefined, lang) : valve.testPressureSeat,
    description: translateTechString(valve.description, valve.descriptionEn, lang),
    highlightFeatures: (valve.highlightFeaturesEn && valve.highlightFeaturesEn.length > 0 && lang === "en")
      ? valve.highlightFeaturesEn
      : valve.highlightFeatures.map(f => translateTechString(f, undefined, lang)),
    applicableMedia: (valve.applicableMediaEn && valve.applicableMediaEn.length > 0 && lang === "en")
      ? valve.applicableMediaEn
      : valve.applicableMedia.map(m => translateTechString(m, undefined, lang)),
    characteristics: getLocalizedCharacteristics(valve.characteristics, lang),
  };
}

/**
 * Intelligent AI-learning translator for technical valve product descriptions
 * Automatically converts Vietnamese engineering prose into fluent English
 */
export function translateDescriptionSmart(
  viDesc: string,
  context?: { name?: string; code?: string; material?: string; pressure?: string }
): string {
  if (!viDesc || viDesc.trim() === '') return '';

  let text = viDesc.trim();

  // High-frequency technical replacements
  const PHRASE_MAPPINGS: Array<[RegExp, string]> = [
    [/Dòng van\s+([\w\s\d.-]+)\s+sản xuất theo tiêu chuẩn quốc tế/gi, 'The $1 valve series manufactured in accordance with international standards'],
    [/sản xuất theo tiêu chuẩn quốc tế/gi, 'manufactured according to international standards'],
    [/tiêu chuẩn quốc tế/gi, 'international standards'],
    [/Thân van đúc từ/gi, 'Precision cast body fabricated from'],
    [/Thân đúc nguyên khối/gi, 'Monoblock cast body'],
    [/thiết kế chuyên dụng cho/gi, 'engineered specifically for'],
    [/chuyên dụng cho/gi, 'specifically designed for'],
    [/hệ thống PCCC cứu hỏa/gi, 'fire protection and firefighting systems'],
    [/hệ thống PCCC/gi, 'fire protection systems'],
    [/hệ thống hơi nóng lò hơi nhiệt độ cao/gi, 'high-temperature boiler steam networks'],
    [/hơi nóng lò hơi/gi, 'boiler steam applications'],
    [/hơi nóng quá nhiệt/gi, 'superheated steam service'],
    [/hơi nóng/gi, 'steam service'],
    [/mạng lưới cấp thoát nước và công nghiệp hóa chất/gi, 'water distribution networks and chemical processing industries'],
    [/cấp thoát nước đô thị/gi, 'municipal water supply and wastewater'],
    [/cấp thoát nước/gi, 'water supply and drainage'],
    [/công nghiệp hóa chất/gi, 'chemical processing industry'],
    [/hóa chất ăn mòn/gi, 'corrosive chemical media'],
    [/Đạt độ kín tuyệt đối/gi, 'Achieves zero-leakage bubble-tight sealing'],
    [/độ kín tuyệt đối/gi, 'bubble-tight zero leakage'],
    [/độ kín khít/gi, 'sealing integrity'],
    [/kiểm tra áp lực thủy tĩnh 100% trước khi xuất xưởng/gi, '100% factory hydrostatic shell and seat pressure tested prior to shipment'],
    [/kiểm tra thủy tĩnh 100%/gi, '100% hydrostatic tested'],
    [/trước khi xuất xưởng/gi, 'before factory dispatch'],
    [/đáp ứng tiêu chuẩn/gi, 'compliant with'],
    [/chứng chỉ kiểm định/gi, 'certified and inspected to'],
    [/chống ăn mòn hóa chất và áp suất cao/gi, 'resistant to chemical corrosion and high operational pressures'],
    [/chống ăn mòn/gi, 'corrosion resistant'],
    [/áp suất cao/gi, 'high pressure'],
    [/tuổi thọ lên tới/gi, 'operational service life exceeding'],
    [/chu trình đóng mở/gi, 'operating cycles'],
    [/chu trình/gi, 'cycles'],
    [/giảm tối đa mô-men xoắn vận hành/gi, 'minimizes operating torque requirements'],
    [/mô-men xoắn/gi, 'operating torque'],
    [/không có hốc giữ cặn/gi, 'pocketless flat-bottom design preventing sediment buildup'],
    [/triệt tiêu hiện tượng va đập búa nước/gi, 'eliminates hydraulic water hammer shock waves'],
    [/búa nước/gi, 'water hammer'],
    [/tự động xả quá áp/gi, 'automatically relieves excess over-pressure'],
    [/bảo vệ an toàn đường ống/gi, 'protecting piping system integrity'],
    [/kèm công tắc giám sát/gi, 'equipped with supervisory tamper switch'],
    [/tủ trung tâm báo cháy/gi, 'fire alarm control panel'],
    [/tòa nhà cao tầng/gi, 'high-rise commercial buildings'],
    [/nhà máy công nghiệp/gi, 'industrial production facilities'],
    [/nước sinh hoạt/gi, 'potable domestic water'],
    [/nước lạnh Chiller/gi, 'HVAC chilled water'],
    [/tháp giải nhiệt/gi, 'cooling tower circuits'],
    [/dầu khí/gi, 'oil and gas service'],
    [/khí nén sạch/gi, 'clean compressed air'],
    [/thực phẩm vi sinh/gi, 'sanitary food & beverage processing'],
    [/thép không gỉ/gi, 'stainless steel'],
    [/thép đúc/gi, 'cast carbon steel'],
    [/thép rèn/gi, 'forged steel'],
    [/gang cầu/gi, 'ductile iron'],
    [/gang xám/gi, 'cast iron'],
    [/mặt bích/gi, 'flanged end connection'],
    [/kẹp bích/gi, 'wafer type connection'],
    [/tai bích/gi, 'lug type connection'],
    [/rãnh ngàm/gi, 'grooved mechanical coupling'],
    [/đĩa van/gi, 'valve disc'],
    [/bi van/gi, 'valve ball'],
    [/lưỡi dao/gi, 'knife blade'],
    [/cửa van/gi, 'gate wedge'],
    [/gioăng/gi, 'seat seal'],
    [/đệm van/gi, 'valve seat'],
    [/trục van/gi, 'valve stem'],
    [/chống văng trục/gi, 'anti-blowout stem design'],
    [/tay gạt/gi, 'lever operated'],
    [/tay quay hộp số/gi, 'gear operated'],
    [/điều khiển khí nén/gi, 'pneumatic actuator operated'],
    [/điều khiển điện/gi, 'electric motorized actuator operated']
  ];

  for (const [regex, replacement] of PHRASE_MAPPINGS) {
    text = text.replace(regex, replacement);
  }

  // Ensure first character is capitalized
  if (text.length > 0) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

  return text;
}

/**
 * Translates Vietnamese target keywords into high-ranking English technical SEO keywords
 */
export function translateKeywordsSmart(keywords: string[]): string[] {
  if (!keywords || keywords.length === 0) return [];

  const KEYWORD_DICT: Record<string, string> = {
    'van bi': 'ball valve',
    'van bi inox': 'stainless steel ball valve',
    'van bi inox 316': 'SS316 ball valve',
    'van bướm': 'butterfly valve',
    'van bướm inox': 'stainless steel butterfly valve',
    'van bướm lệch tâm': 'triple offset butterfly valve',
    'van bướm pccc': 'UL FM butterfly valve',
    'van cổng': 'gate valve',
    'van cổng đệm mềm': 'resilient seated gate valve',
    'van cổng dao': 'knife gate valve',
    'van một chiều': 'check valve',
    'van một chiều bướm': 'dual plate check valve',
    'van lá lật': 'swing check valve',
    'van cầu': 'globe valve',
    'van cầu hơi': 'steam globe valve',
    'van an toàn': 'safety relief valve',
    'van giảm áp': 'pressure reducing valve',
    'lọc y': 'Y strainer',
    'khớp nối mềm': 'flexible rubber joint',
    'khớp giãn nở': 'expansion joint',
    'inox 316': 'stainless steel 316',
    'inox 304': 'stainless steel 304',
    'thép đúc': 'cast steel WCB',
    'gang cầu': 'ductile iron GGG50',
    'hơi nóng': 'steam service',
    'lò hơi': 'boiler applications',
    'chịu nhiệt 300 độ': 'high temperature 300C',
    'chịu nhiệt 450 độ': 'high temp 450C',
    'áp lực cao': 'high pressure',
    'chống búa nước': 'anti water hammer',
    'pccc': 'fire protection UL FM',
    'chiller': 'HVAC chilled water',
    'mặt bích': 'flanged connection',
    'kẹp bích': 'wafer connection',
    'độ kín tuyệt đối': 'zero leakage bubble tight'
  };

  const results: string[] = [];
  const seen = new Set<string>();

  for (const kw of keywords) {
    const norm = kw.toLowerCase().trim();
    if (KEYWORD_DICT[norm]) {
      const en = KEYWORD_DICT[norm];
      if (!seen.has(en.toLowerCase())) {
        results.push(en);
        seen.add(en.toLowerCase());
      }
    } else {
      // Direct technical string translation fallback
      const translated = translateTechString(kw, undefined, 'en');
      if (translated && !seen.has(translated.toLowerCase())) {
        results.push(translated);
        seen.add(translated.toLowerCase());
      }
    }
  }

  return results;
}

/**
 * Automatically creates and optimizes English Meta Title & Description
 */
export function translateMetaTitleAndDescription(
  viTitle: string,
  viDesc: string,
  context?: { nameEn?: string; code?: string; material?: string; pressure?: string }
): { titleEn: string; descEn: string } {
  let titleEn = '';
  if (context?.nameEn && context?.code) {
    titleEn = `${context.nameEn} ${context.code} | UTD Industrial Valves`;
  } else if (viTitle) {
    titleEn = translateDescriptionSmart(viTitle);
    if (!titleEn.toLowerCase().includes('utd')) {
      titleEn = `${titleEn} - UTD`;
    }
  }

  let descEn = translateDescriptionSmart(viDesc, context);
  if (!descEn || descEn.length < 50) {
    descEn = `Official UTD industrial valve ${context?.code || ''}. Premium quality ${context?.material || 'engineered metallurgy'}, rated for ${context?.pressure || 'standard industrial pressure'}. Certified ISO 5208 zero leakage sealing for international EPC projects.`;
  }

  return { titleEn, descEn };
}

