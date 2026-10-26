import { SupportedLanguage } from '../types/valve';

export type ValveNewsCategory = 
  | 'operation' 
  | 'installation' 
  | 'troubleshooting' 
  | 'selection' 
  | 'standards';

export interface TechnicalTermGlossary {
  term: string;
  termVi: string;
  definitionVi: string;
  definitionEn: string;
}

export interface ValveNewsArticle {
  id: string;
  title: string;
  titleEn: string;
  category: ValveNewsCategory;
  categoryLabelVi: string;
  categoryLabelEn: string;
  sourceCitation: {
    publisherOrBrand: string; // e.g. "Valve World Magazine", "Spirax Sarco Engineering", "Fisher Emerson"
    documentTitle: string;    // e.g. "Control Valve Handbook - Cavitation Diagnosis"
    publicationCode: string;  // e.g. "ISSN 1386-8969 / ASME Paper GT2025-4412"
    sourceUrl?: string;
  };
  publishDate: string;
  readTimeMinutes: number;
  featuredImage: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  glossary: TechnicalTermGlossary[];
  keyTakeaways: string[];
  keyTakeawaysEn: string[];
  recommendedValveCodes: string[];
}

export const VALVE_NEWS_ARTICLES: ValveNewsArticle[] = [
  {
    id: 'vn-2026-001',
    title: 'Giải Pháp Kiểm Soát Và Khắc Phục Hiện Tượng Xâm Thực (Cavitation) Trong Van Cầu Lò Hơi Áp Lực Cao',
    titleEn: 'Mitigating Cavitation & Flashing in High-Pressure Boiler Feedwater Globe Valves',
    category: 'troubleshooting',
    categoryLabelVi: 'Khắc Phục Sự Cố & Rò Rỉ',
    categoryLabelEn: 'Troubleshooting & Cavitation',
    sourceCitation: {
      publisherOrBrand: 'Tạp chí Công Nghệ Dòng Chảy Flow Control & Emerson Fisher Technical Whitepaper',
      documentTitle: 'Control Valve Cavitation & Flashing Mitigation in Power Generation Piping Systems',
      publicationCode: 'ASME Paper No. PVP2025-10294 / Fisher Bulletin 51.1:020',
      sourceUrl: 'https://www.flowcontrolnetwork.com/valves-actuators'
    },
    publishDate: '2026-03-28',
    readTimeMinutes: 7,
    featuredImage: '/uploads/valve_detail.jpg',
    summary: 'Khi chênh áp qua van cầu vượt quá áp suất bốc hơi của chất lỏng, bọt khí áp suất thấp hình thành và sụp đổ tức thì với áp lực cục bộ lên tới 7,000 bar. Hướng dẫn kỹ thuật lựa chọn vật liệu Stellite tôi cứng và cấu trúc đĩa van nhiều tầng giảm áp (Multi-Stage Trim) để triệt tiêu hoàn toàn xâm thực.',
    summaryEn: 'When differential pressure across a globe valve exceeds vapor pressure, micro vapor bubbles form and collapse violently at localized pressures up to 7,000 bar. Engineering guidelines on selecting Stellite Gr.6 hardfacing and multi-stage anti-cavitation trims.',
    content: `Hiện tượng xâm thực (Cavitation) là nguyên nhân hàng đầu phá hủy thân van và đĩa van trong các hệ thống cấp nước lò hơi và trạm giảm áp hơi nóng.

1. Cơ Chế Vật Lý Của Hiện Tượng Xâm Thực:
Khi dòng chất lỏng đi qua khe hẹp giữa đĩa van (Plug) và ghế van (Seat), vận tốc tăng vọt làm áp suất tĩnh giảm xuống dưới áp suất hơi bão hòa (P < Pv). Các bọt khí li ti lập tức xuất hiện. Ngay sau khi qua khỏi khe hẹp, dòng chảy mở rộng, vận tốc giảm và áp suất phục hồi (Pressure Recovery). Áp suất tăng trở lại làm các bọt khí sụp đổ đột ngột (implosion), giải phóng sóng xung kích cục bộ có thể đạt tới 7,000 bar (100,000 psi) và nhiệt độ tức thời hàng ngàn độ C.

2. Dấu Hiệu Nhận Biết Trên Đường Ống Thực Tế:
- Tiếng ồn đặc trưng: Nghe như có tiếng sỏi đá hoặc cát vụn va đập dữ dội bên trong thân van.
- Rung động cơ học: Đường ống bị rung lắc với tần số cao, gây lỏng bulông mặt bích và mỏi mối hàn.
- Xói mòn bề mặt kim loại: Bề mặt đĩa van và ghế van bị rỗ tổ ong xù xì, mất khả năng làm kín (mất cấp độ kín ISO 5208 Rate A).

3. Giải Pháp Khắc Phục Kỹ Thuật Đạt Chuẩn:
- Sử dụng đĩa van nhiều tầng giảm áp (Multi-Stage Cavitation Trim): Chia chênh áp tổng ΔP thành nhiều bậc nhỏ, đảm bảo tại mọi điểm áp suất dòng chảy không bao giờ tụt xuống dưới áp suất bốc hơi Pv.
- Nâng cấp vật liệu chế tạo: Sử dụng đĩa và ghế van tôi phủ hợp kim Stellite Gr.6 (Cobalt-Chromium-Tungsten) với độ cứng trên 42 HRC, kháng mài mòn vượt trội so với Inox 304/316 thông thường.
- Lắp đặt van góc (Angle Pattern): Dòng chảy xả thẳng vào tâm ống downstream, tránh va đập trực tiếp vào thành thân van.`,
    contentEn: `Cavitation is the primary root cause of trim and body erosion in boiler feedwater and pressure-reducing loops.

1. Physics of Cavitation:
As fluid velocity peaks at the vena contracta, static pressure drops below vapor pressure, generating vapor bubbles. As downstream pressure recovers, these bubbles implode violently, producing micro-jets exceeding 7,000 bar.

2. Diagnostic Symptoms:
- Cinder-like gravel sound inside the valve body.
- Severe high-frequency piping vibration loosening flange stud bolts.
- Sponge-like pitting on the plug and seat face destroying sealing integrity.

3. Engineering Countermeasures:
- Implement multi-stage pressure-drop trims ensuring pressure never drops below fluid vapor pressure.
- Upgrade trim surfaces with Stellite Gr.6 hardfacing (>42 HRC).
- Transition to Angle Pattern valve bodies directing the stream into the downstream piping axis.`,
    glossary: [
      {
        term: 'Cavitation',
        termVi: 'Hiện tượng xâm thực / bọt khí sụp đổ',
        definitionVi: 'Quá trình tạo bọt khí do áp suất cục bộ giảm dưới áp suất hóa hơi của chất lỏng, sau đó sụp đổ dữ dội khi áp suất hồi phục, gây rỗ kim loại.',
        definitionEn: 'The formation and subsequent violent collapse of vapor bubbles in a liquid when local pressure drops below vapor pressure.'
      },
      {
        term: 'Vena Contracta',
        termVi: 'Tiết diện dòng thắt hẹp nhất',
        definitionVi: 'Vị trí dòng chảy đạt diện tích hẹp nhất và vận tốc cao nhất ngay sau khe hở giữa đĩa van và ghế van.',
        definitionEn: 'The point in a fluid stream where diameter is smallest and velocity is highest just downstream of the valve orifice.'
      },
      {
        term: 'Stellite Gr.6',
        termVi: 'Hợp kim siêu cứng tôi phủ Cobalt-Crom',
        definitionVi: 'Hợp kim tôi bề mặt chịu mài mòn, chống xói lở và giữ độ cứng tốt ở nhiệt độ cao trên 450°C.',
        definitionEn: 'A cobalt-based hardfacing alloy providing superior erosion, galling, and cavitation resistance at elevated temperatures.'
      }
    ],
    keyTakeaways: [
      'Không dùng van cầu 1 tầng tiêu chuẩn khi tỉ số chênh áp FL > 0.85.',
      'Bắt buộc kiểm tra độ cứng đĩa van đạt tối thiểu 40-45 HRC đối với nước nóng > 120°C.',
      'Lựa chọn van có thiết kế Y-Pattern hoặc Angle Pattern để giảm tổn thất áp suất dư thừa.'
    ],
    keyTakeawaysEn: [
      'Avoid single-stage globe valves when pressure recovery factor FL exceeds 0.85.',
      'Mandate trim surface hardness >40 HRC for boiler feedwater above 120°C.',
      'Utilize Y-Pattern or Angle bodies to reduce parasitic head losses.'
    ],
    recommendedValveCodes: ['UTD-GL-300', 'UTD-GL-PN25', 'UTD-BV-HP']
  },
  {
    id: 'vn-2026-002',
    title: 'Quy Chuẩn Lắp Đặt Van Bướm Đồng Tâm (Concentric) Và Hiệu Suất Cao (High-Performance) Tránh Hỏng Đệm Đĩa',
    titleEn: 'Installation Standards for Concentric vs Double-Offset Butterfly Valves to Prevent Liner Distortion',
    category: 'installation',
    categoryLabelVi: 'Kỹ Thuật Lắp Đặt & Đấu Nối',
    categoryLabelEn: 'Installation Guidelines',
    sourceCitation: {
      publisherOrBrand: 'Hiệp Hội Kỹ Sư Đường Ống Hoa Kỳ (MCAA) & Bray Controls Technical Bulletin',
      documentTitle: 'Proper Flange Bolting, Alignment and Disc Clearance for Resilient and High Performance Butterfly Valves',
      publicationCode: 'MCAA Guidelines Sec. 4.2 / Bray TB-1044',
      sourceUrl: 'https://bray.com/technical-bulletins'
    },
    publishDate: '2026-03-15',
    readTimeMinutes: 6,
    featuredImage: '/uploads/hero_pipeline.jpg',
    summary: 'Hơn 68% sự cố kẹt đĩa và rách gioăng cao su van bướm xuất phát từ việc siết bulông mặt bích khi van đang đóng kín hoàn toàn hoặc sử dụng gioăng mặt bích phụ không cần thiết. Hướng dẫn chuẩn hóa quy trình lắp đặt góc mở 10-20% theo ASME B16.5.',
    summaryEn: 'Over 68% of butterfly valve liner failures stem from torqueing flange bolts while the disc is fully closed or adding redundant flat gaskets. Best practices for 10-20% pre-cracked disc installation per ASME B16.5.',
    content: `Van bướm là thiết bị chiếm tỉ trọng lớn nhất trong các công trình M&E, PCCC và trạm bơm xử lý nước. Tuy nhiên, sai sót khi lắp đặt wafer/lugged thường gây rách gioăng EPDM hoặc cong trục van.

1. Quy Tắc Vàng 1: Luôn Mở Đĩa Van Ở Góc 10° Đến 20° Khi Định Vị:
Tuyệt đối không siết bulông khi đĩa van đang đóng kín (0°). Khi đóng hoàn toàn, viền đĩa van ép chặt vào cao su làm tăng bề dày gioăng. Nếu siết bulông lúc này, đệm cao su sẽ bị bẹp méo và kẹp chặt lấy cạnh đĩa. Khi cấp điện cho động cơ hoặc vặn tay quay lần đầu, mô-men xoắn sẽ tăng vọt làm cháy động cơ điều khiển hoặc gãy chốt chẻ trục van.
Ngược lại, cũng không mở đĩa 90° vì mép đĩa nhô ra ngoài sẽ bị va quệt vào mép trong của ống khi hạ van vào khe bích. Góc an toàn tuyệt đối là 10° - 20°.

2. Quy Tắc Vàng 2: Không Dùng Thêm Gioăng Bìa / Gioăng Phụ Khi Lắp Van Bướm Đệm Cao Su (Concentric):
Đệm đúc cao su (EPDM/NBR) của van bướm đồng tâm đã được đúc tràn ra ngoài gờ mặt bích để đóng vai trò làm kín trực tiếp với mặt bích ống thép. Nếu người thợ lót thêm gioăng cao su hoặc gioăng amiăng bên ngoài, đệm van sẽ bị đẩy lệch tâm và phồng rộp vào trong lòng ống, cản trở chuyển động quay của đĩa.

3. Quy Tắc Vàng 3: Siết Bulông Theo Trình Tự Đối Xứng Chữ Thập (Star Pattern):
Siết theo 3 bước: 30% lực mô-men xoắn định mức -> 70% lực -> 100% lực với cờ lê lực (Torque Wrench). Siết lệch một bên sẽ làm vênh thân van wafer, gây rò rỉ cổ trục (Stem Packing Leakage).`,
    contentEn: `Butterfly valves dominate M&E and water transmission projects. However, improper wafer mounting frequently crushes elastomeric liners.

1. Golden Rule 1: Pre-Open Disc to 10°-20° During Fit-Up:
Never tighten flange bolts with the disc in full 0° closure. Full closure expands the seat elastomer; torquing bolts will pinch the liner against the disc edge, causing actuator stalling upon initial stroke. Disc must be slightly open (10°-20°) within body face boundaries.

2. Golden Rule 2: Eliminate Redundant Flange Gaskets on Resilient-Seated Valves:
The molded liner face functions as the primary face-to-face flange seal. Adding external sheet gaskets leads to seat extrusion into the waterway.

3. Golden Rule 3: Use Cross-Pattern Star Torquing:
Torque in three passes (30%, 70%, 100%) using a calibrated torque wrench to prevent body deflection and stem packing leakage.`,
    glossary: [
      {
        term: 'Concentric (Zero-Offset)',
        termVi: 'Van bướm đồng tâm (Độ lệch tâm bằng 0)',
        definitionVi: 'Trục van nằm chính giữa đường tâm đĩa và đường tâm ống, đĩa van tiếp xúc ma sát liên tục với đệm cao su trong suốt góc quay 90°.',
        definitionEn: 'A design where the stem axis is centered along both disc centerline and body centerline.'
      },
      {
        term: 'Torque Wrench',
        termVi: 'Cờ lê lực định mức',
        definitionVi: 'Dụng cụ siết bulông có đồng hồ kiểm soát lực siết chính xác theo thông số khuyến cáo của nhà sản xuất.',
        definitionEn: 'A calibrated tool used to apply a specific torque to bolted flange connections.'
      },
      {
        term: 'Cold Flow / Creep',
        termVi: 'Hiện tượng biến dạng dẻo trôi của nhựa PTFE/EPDM',
        definitionVi: 'Sự chảy giãn vĩnh viễn của vật liệu phi kim dưới áp lực nén cơ học liên tục trong thời gian dài.',
        definitionEn: 'Permanent deformation of polymeric materials under constant mechanical compressive stress.'
      }
    ],
    keyTakeaways: [
      'Góc mở an toàn khi siết bulông mặt bích là 10° - 20°.',
      'Không lót thêm gioăng phụ đối với van bướm thân bọc cao su hoàn toàn.',
      'Kiểm tra đường kính trong lòng ống thép (ID) để mép đĩa không chạm thành ống khi mở 90°.'
    ],
    keyTakeawaysEn: [
      'Maintain 10°-20° disc clearance during flange bolting.',
      'Never insert companion flange gaskets on fully rubber-lined valves.',
      'Verify pipe inside diameter (ID) clearance to prevent disc impingement at 90°.'
    ],
    recommendedValveCodes: ['UTD-BF-100', 'UTD-BF-HP-200', 'UTD-BF-TOV-300']
  },
  {
    id: 'vn-2026-003',
    title: 'Quy Trình Kiểm Tra & Khắc Phục Hiện Tượng Búa Nước (Water Hammer) Phá Hủy Đường Ống Máy Bơm',
    titleEn: 'Transient Surge & Water Hammer Suppression in High-Head Pumping Stations',
    category: 'troubleshooting',
    categoryLabelVi: 'Khắc Phục Sự Cố & Rò Rỉ',
    categoryLabelEn: 'Water Hammer & Surge',
    sourceCitation: {
      publisherOrBrand: 'Tạp Chí Quốc Tế Valve World Magazine & Kitz Industrial Engineering Bulletin',
      documentTitle: 'Slamming Check Valves: Root Cause Analysis of Hydraulic Shock and Rapid Closure Countermeasures',
      publicationCode: 'Valve World Vol. 31, Issue 2 / ISO 5208 Surge Annex',
      sourceUrl: 'https://valve-world.net/articles'
    },
    publishDate: '2026-03-02',
    readTimeMinutes: 8,
    featuredImage: '/uploads/studio_ball_valve.jpg',
    summary: 'Hiện tượng búa nước do van một chiều đóng chậm khi mất điện đột ngột có thể tạo xung áp suất gấp 4 đến 8 lần áp suất thiết kế, gây nứt vỡ thân van và mối nối ống. Phân tích nguyên lý lựa chọn van một chiều cánh bướm lò xo kép (Dual Plate) và van một chiều chống búa nước trục nghiêng (Non-Slam Silent Check).',
    summaryEn: 'Hydraulic shock generated by slow-closing check valves during sudden pump trips can generate pressure waves 4 to 8 times nominal rating. Engineering comparison between Dual Plate spring-assisted and Silent Non-Slam check valves.',
    content: `Khi máy bơm công suất lớn bị ngắt điện đột ngột, cột nước hàng ngàn tấn trong ống đứng bị mất động năng và đảo chiều quay ngược lại. Nếu van một chiều không đóng kịp thời, dòng chảy ngược sẽ đóng sập cánh van với vận tốc cực lớn, tạo nên hiện tượng búa nước (Water Hammer / Hydraulic Shock).

1. Tác Hại Khôn Lường Của Tiếng Đóng Đập (Valve Slam):
- Xung áp Joukowsky sinh ra sóng áp suất truyền đi với vận tốc âm thanh trong nước (~1,200 m/s).
- Áp suất va đập vượt quá áp lực thử phá hủy của ống, dẫn đến vỡ mặt bích, giật sập giá đỡ ống (Pipe Support) và hư hại cánh bơm.

2. So Sánh Động Học Giữa Các Kiểu Van 1 Chiều:
- Van một chiều lá lật truyền thống (Swing Check): Hành trình cánh van quay góc 70°-80° rất dài và chỉ đóng nhờ trọng lực. Dòng nước đã chảy ngược với vận tốc cao trước khi cánh chạm ghế van -> Gây búa nước nghiêm trọng nhất.
- Van một chiều cánh bướm đôi (Dual Plate Wafer Check): Cánh van nhẹ, hành trình quay ngắn (45°), có lò xo Inox hỗ trợ ép đóng trước khi dòng nước kịp đổi chiều -> Giảm 75% xung áp.
- Van một chiều chống búa nước lò xo dọc trục (Silent Lift Non-Slam Check): Đĩa van chuyển động tịnh tiến theo trục, lò xo tải trước ép đóng trong thời gian dưới 0.15 giây -> Hoàn toàn không gây tiếng đập (Zero Slam).

3. Giải Pháp Toàn Diện Cho Trạm Bơm Cao Tầng & Thủy Cấp:
- Luôn lắp đặt van 1 chiều Silent Non-Slam ngay tại đầu xả máy bơm.
- Bố trí bình tích áp khí nén (Surge Vessel) hoặc van xả áp búa nước khẩn cấp (Surge Relief Valve) cài đặt xả ở 110% áp suất danh định PN.`,
    contentEn: `When a pump trips, gravitational backflow rapidly accelerates down the pipeline. If the check valve does not shut prior to velocity reversal, the disc slams with destructive acoustic shock.

1. Joukowsky Pressure Surge Effects:
Shockwaves propagate at sonic velocities (~1,200 m/s), generating transient pressures up to 8x normal operating heads, snapping pipe supports and cracking cast iron flanges.

2. Dynamic Response Comparison:
- Swing Check Valve: Long 70° travel arc relying purely on gravity; allows significant backflow velocity before closure, maximizing slam.
- Dual Plate Wafer Check: Torsion spring assisted with short 45° travel arc; cuts slam energy by 75%.
- Axial Nozzle Silent Check: Center-guided streamlined disc with spring closing in under 0.15s, ensuring zero slam.

3. Pump Discharge Best Practice:
Install Axial Silent Check valves immediately downstream of pump headers accompanied by surge relief valves set at 110% PN.`,
    glossary: [
      {
        term: 'Water Hammer / Hydraulic Shock',
        termVi: 'Hiện tượng búa nước / thủy kích',
        definitionVi: 'Sóng xung áp sinh ra khi dòng chất lỏng đang chuyển động tốc độ cao bị chặn đứng đột ngột bởi van đóng chậm.',
        definitionEn: 'A high-pressure surge wave created when a fluid in motion is forced to stop or change direction suddenly.'
      },
      {
        term: 'Non-Slam Check Valve',
        termVi: 'Van một chiều đóng êm / chống đập thủy lực',
        definitionVi: 'Van một chiều trang bị lò xo phản hồi tốc độ cao, hoàn thành hành trình đóng kín trước khi dòng chất lỏng kịp đảo chiều.',
        definitionEn: 'A check valve engineered with internal spring assist to achieve positive closure prior to flow reversal.'
      },
      {
        term: 'Joukowsky Equation',
        termVi: 'Phương trình tính toán xung áp búa nước Joukowsky',
        definitionVi: 'Công thức toán học ΔP = ρ * c * Δv dùng để tính độ tăng áp suất tức thời khi vận tốc dòng chất lỏng thay đổi đột ngột.',
        definitionEn: 'Fundamental acoustic formula calculating transient pressure rise based on fluid density, acoustic wave speed, and velocity delta.'
      }
    ],
    keyTakeaways: [
      'Tuyệt đối không dùng van 1 chiều lá lật thường cho đường ống bơm đẩy nhà cao tầng > 30m.',
      'Sử dụng van một chiều lò xo trục dọc Silent Non-Slam UTD-CV-SILENT để triệt tiêu tiếng ồn.',
      'Lắp van xả áp búa nước trước van một chiều để bảo vệ an toàn cho buồng bơm.'
    ],
    keyTakeawaysEn: [
      'Do not apply gravity swing checks on vertical risers above 30m head.',
      'Standardize on axial spring-assisted silent check valves to eliminate pipe vibration.',
      'Incorporate surge anticipating relief valves for critical municipal pumping stations.'
    ],
    recommendedValveCodes: ['UTD-CV-200', 'UTD-CV-DP-16', 'UTD-SRV-150']
  },
  {
    id: 'vn-2026-004',
    title: 'Cẩm Nang Tính Toán Lưu Lượng Kv/Cv & Lựa Chọn Kích Thước Van Chuẩn Xác Tránh Hiện Tượng Oversizing',
    titleEn: 'Valve Sizing & Cv/Kv Engineering Guide: Avoiding Damaging Oversizing Mistakes',
    category: 'selection',
    categoryLabelVi: 'Lựa Chọn & Tính Toán Van',
    categoryLabelEn: 'Selection & Sizing Guide',
    sourceCitation: {
      publisherOrBrand: 'Tài Liệu Kỹ Thuật Viện Năng Lượng Lò Hơi Spirax Sarco & Tiêu Chuẩn Quốc Tế ISA 75.01',
      documentTitle: 'Flow Equations for Sizing Control Valves - IEC 60534-2-1 / ISA-75.01.01 Standards',
      publicationCode: 'Spirax Sarco Steam Engineering Guide Section 6 / IEC 60534',
      sourceUrl: 'https://spiraxsarco.com/resources/steam-engineering-tutorials'
    },
    publishDate: '2026-02-18',
    readTimeMinutes: 9,
    featuredImage: '/uploads/valve_detail.jpg',
    summary: 'Sai lầm phổ biến nhất của kỹ sư là chọn kích thước van bằng đúng kích thước đường ống (Line Size) thay vì tính toán lưu lượng Cv thực tế. Van quá khổ (Oversized) khiến đĩa van chỉ mở 5-15%, gây mài mòn cục bộ (Wire Drawing), rung lắc van và mất kiểm soát nhiệt độ.',
    summaryEn: 'Selecting valve size equal to pipe nominal size rather than calculating required Cv leads to severe oversizing. Operating throttled at 5-15% causes wire drawing, seat chatter, and loss of process control.',
    content: `Trong thiết kế hệ thống cơ điện M&E và hơi nóng công nghiệp, kích thước danh định của ống (Pipe Line Size) được tính toán dựa trên vận tốc dòng chảy kinh tế (nước: 1.5 - 2.5 m/s; hơi nóng: 20 - 35 m/s). Tuy nhiên, kích thước van (Valve Body Size) bắt buộc phải được tính toán dựa trên hệ số lưu lượng Cv hoặc Kv.

1. Định Nghĩa Chuẩn Xác Hệ Số Lưu Lượng:
- Kv (Hệ Mét m3/h): Lưu lượng nước sạch (ở 5°C - 40°C) tính bằng m3/h chảy qua van khi độ giảm áp suất chênh lệch ΔP = 1 bar.
- Cv (Hệ Mỹ US GPM): Lưu lượng nước sạch tính bằng gallon/phút (GPM) ở 60°F khi độ giảm áp suất ΔP = 1 psi.
- Công thức quy đổi chuẩn xác: Cv = Kv * 1.156 (hoặc Kv = Cv * 0.865).

2. Hiểm Họa Khi Van Bị Quá Khổ (Oversized):
- Vận hành ở góc mở nhỏ nguy hiểm (Hunting): Khi van quá lớn so với tải thực tế, van buộc phải làm việc ở góc mở 5% đến 15%. Tại đây, lưu lượng thay đổi rất đột ngột với từng dịch chuyển nhỏ của đĩa van, khiến bộ điều khiển nhiệt độ/áp suất liên tục bị dao động quanh điểm cài đặt (Hunting).
- Cắt gọt đệm van bằng tia áp lực cao (Wire Drawing): Dòng lưu chất vận tốc cực cao lọt qua khe hở li ti sẽ cắt xẻ bề mặt đĩa van giống như dao cắt kim loại, làm van hỏng hoàn toàn chỉ sau vài tuần vận hành.

3. Nguyên Tắc Lựa Chọn Kích Thước Tối Ưu:
- Đối với van điều tiết tuyến tính: Góc mở tối đa ở lưu lượng Max nên nằm trong khoảng 70% - 85%; góc mở ở lưu lượng Min không được thấp hơn 20%.
- Kích thước van điều tiết thông thường sẽ nhỏ hơn kích thước đường ống từ 1 đến 2 size danh định (Ví dụ: Ống DN100 thường lắp van điều khiển DN65 hoặc DN80 kết hợp côn thu Eccentric/Concentric Reducer).`,
    contentEn: `Piping sizing is dictated by economic velocities (water: 1.5-2.5 m/s; steam: 25-35 m/s), whereas control valves must be sized strictly by flow capacity factor Cv.

1. Definitions:
- Kv (Metric m3/h): Water flow in m3/h at 5-40°C with 1 bar differential pressure drop.
- Cv (US GPM): Water flow in US gallons/min at 60°F with 1 psi pressure drop.
- Conversion ratio: Cv = 1.156 * Kv.

2. Consequences of Oversizing:
- Control hunting: Operating at 5-15% stroke causes erratic control oscillations.
- Wire drawing: Sonic fluid velocity across microscopic throttling crevices cuts precision seat faces within weeks.

3. Sizing Rules of Thumb:
- Normal operating point must lie between 60% and 80% stroke. Minimum flow must never fall below 15-20% stroke.
- Control valve diameter is typically 1 to 2 pipe sizes smaller than companion headers.`,
    glossary: [
      {
        term: 'Flow Coefficient Cv / Kv',
        termVi: 'Hệ số lưu lượng dòng chảy',
        definitionVi: 'Đại lượng vật lý đại diện cho năng lực thông qua dòng chất lỏng của một thiết bị van tại một độ mở và độ chênh áp xác định.',
        definitionEn: 'The imperial (Cv) or metric (Kv) capacity factor relating volumetric flow rate to differential pressure drop across a valve.'
      },
      {
        term: 'Wire Drawing',
        termVi: 'Hiện tượng rãnh cắt xẻ bề mặt đĩa van',
        definitionVi: 'Sự xói mòn tạo thành các rãnh sâu trên bề mặt kim loại do dòng chất lỏng vận tốc cao lọt qua khe đóng không kín.',
        definitionEn: 'Erosion of a valve seat or closure member caused by high-velocity fluid leakage through tiny clearances.'
      },
      {
        term: 'Rangeability',
        termVi: 'Tỉ số dải điều tiết',
        definitionVi: 'Tỉ số giữa lưu lượng điều khiển lớn nhất và lưu lượng điều khiển nhỏ nhất mà van vẫn duy trì đặc tính dòng ổn định (thường từ 30:1 đến 50:1).',
        definitionEn: 'The ratio between maximum and minimum controllable flow rates within acceptable performance limits.'
      }
    ],
    keyTakeaways: [
      'Không bao giờ chọn van điều khiển bằng kích cỡ đường ống mà không tính Cv.',
      'Quy đổi nhanh: Cv = Kv * 1.156.',
      'Đảm bảo góc mở van vận hành ổn định trong khoảng 25% đến 80% hành trình.'
    ],
    keyTakeawaysEn: [
      'Never size a control valve line-size without verifying required Cv.',
      'Conversion benchmark: Cv = 1.156 * Kv.',
      'Ensure standard operating load lands within 25% to 80% valve opening stroke.'
    ],
    recommendedValveCodes: ['UTD-CV-BAL', 'UTD-GL-STEAM', 'UTD-PRV-40']
  },
  {
    id: 'vn-2026-005',
    title: 'Cập Nhật Tiêu Chuẩn Rò Rỉ Khí Thải Qua Cổ Van ISO 15848-1 & Tiêu Chuẩn Thử Áp Lực API 598 Năm 2026',
    titleEn: 'Fugitive Emissions ISO 15848-1 Class AH & Hydrostatic API 598 / ISO 5208 Standards Update',
    category: 'standards',
    categoryLabelVi: 'Tiêu Chuẩn & Xu Hướng',
    categoryLabelEn: 'Standards & Compliance',
    sourceCitation: {
      publisherOrBrand: 'Tổ Chức Tiêu Chuẩn Hóa Quốc Tế (ISO) & Viện Dầu Mỏ Hoa Kỳ (API)',
      documentTitle: 'Industrial Valves: Measurement, Test and Qualification Procedures for Fugitive Emissions / Valve Inspection and Testing',
      publicationCode: 'ISO 15848-1:2024 Edition / API Standard 598 10th Edition',
      sourceUrl: 'https://www.iso.org/standard/76509.html'
    },
    publishDate: '2026-01-10',
    readTimeMinutes: 7,
    featuredImage: '/uploads/studio_ball_valve.jpg',
    summary: 'Các quy định môi trường mới nghiêm ngặt đối với rò rỉ khí độc hại và khí nhà kính (Fugitive Emissions) bắt buộc các nhà máy hóa chất, lọc dầu và khí đốt phải chuyển đổi sang van đạt chứng nhận ISO 15848-1 Cấp AH với độ rò rỉ dưới 10^-6 mg/(s*m). Chi tiết yêu cầu đệm kín graphite và ống xếp kim loại Bellows Seal.',
    summaryEn: 'Stringent ESG regulations for VOC and toxic fugitive emissions mandate ISO 15848-1 Class AH qualification (<10^-6 mg/s*m). Technical requirements for live-loaded graphite packings and metallic bellows seals.',
    content: `Rò rỉ khí qua cổ van (Stem Packing) chiếm tới hơn 50% tổng lượng phát thải phân tán (Fugitive Emissions) trong các nhà máy lọc hóa dầu, chế biến hóa chất và trạm phân phối khí gas.

1. Tiêu Chuẩn ISO 15848-1 Phân Hạng Thế Nào?
- Cấp rò rỉ A (Class AH): Độ kín khít cao nhất, mức rò rỉ Helium thấp hơn 10^-6 mg/(s*m) chu vi trục van. Thường bắt buộc sử dụng cấu trúc ống xếp kim loại kín tuyệt đối (Bellows Seal Globe Valve).
- Cấp rò rỉ B (Class BH): Mức rò rỉ dưới 10^-4 mg/(s*m), sử dụng công nghệ đệm Graphite nén đàn hồi liên tục bằng lò xo đĩa (Live-Loaded Stem Packing).
- Cấp nhiệt độ thử nghiệm: Phải trải qua từ -46°C đến +400°C với tối thiểu 2,500 chu trình đóng mở cơ học (Mechanical Cycles CO1/CO2).

2. Tiêu Chuẩn Thử Nghiệm Áp Suất API 598 / ISO 5208:
- Thử nghiệm vỏ van (Shell Test): Áp suất bằng 1.5 lần áp suất danh định PN ở nhiệt độ phòng. Thời gian duy trì từ 15 giây đến 3 phút tùy theo kích thước DN. Yêu cầu không có bất kỳ giọt ẩm hay bọt khí nào rò rỉ qua thành van.
- Thử nghiệm độ kín ghế van (Seat Test):
  * Đối với van đệm mềm (Resilient Soft Seat): Bắt buộc đạt ISO 5208 Rate A (Không có bọt khí rò rỉ - Zero Leakage).
  * Đối với van đệm kim loại (Metal-to-Metal Seat): Cho phép rò rỉ theo Rate D hoặc Rate E tùy theo tiêu chuẩn kiểm định API 6D.

3. Cam Kết Của Van Công Nghiệp UTD:
Toàn bộ sản phẩm van bi, van bướm hiệu suất cao và van cầu hơi UTD xuất xưởng đều được kiểm định áp lực thủy tĩnh 100% tại nhà máy kèm biên bản kiểm định xuất xưởng EN 10204 3.1 Inspection Certificate.`,
    contentEn: `Stem packing leaks account for over 50% of fugitive volatile organic compound (VOC) emissions in petrochemical refineries.

1. ISO 15848-1 Emission Classes:
- Class AH: Leak rate <10^-6 mg/(s*m), achieved via hermetic metallic bellows seals or live-loaded engineered packings.
- Class BH: Leak rate <10^-4 mg/(s*m), standard for fire-safe live-loaded graphite packings.
- Endurance testing mandates 2,500 mechanical strokes through -46°C to +400°C thermal cycling.

2. API 598 Hydrostatic Testing Benchmarks:
- Shell Hydrostatic Test: 1.5x cold working pressure with zero observable sweating or through-wall leakage.
- Seat Closure Test: Resilient-seated soft seats must achieve ISO 5208 Rate A (Bubble-Tight, Zero Leakage).

3. Quality Assurance:
Every UTD valve undergoes 100% hydro-testing and is issued with EN 10204 3.1 Mill Inspection Certificates.`,
    glossary: [
      {
        term: 'Fugitive Emissions',
        termVi: 'Phát thải rò rỉ phân tán qua cổ van',
        definitionVi: 'Khí độc hại hoặc hơi hóa chất rò rỉ thất thoát không kiểm soát qua bộ phận làm kín cổ van và mặt bích ra môi trường xung quanh.',
        definitionEn: 'Unintended emissions of gases or vapors from pressurized equipment components such as valve stems.'
      },
      {
        term: 'ISO 5208 Rate A',
        termVi: 'Cấp độ kín khít tuyệt đối bọt khí',
        definitionVi: 'Cấp kiểm thử làm kín cao nhất thế giới dành cho van công nghiệp, không cho phép xuất hiện bọt khí trong suốt thời gian ngâm áp.',
        definitionEn: 'The highest tightness classification under ISO 5208 with zero detectable bubble leakage.'
      },
      {
        term: 'Bellows Seal',
        termVi: 'Ống xếp kim loại làm kín cổ van',
        definitionVi: 'Cấu trúc màng xếp Inox hàn kín cách ly hoàn toàn trục van khỏi môi chất độc hại, loại trừ 100% rò rỉ cổ van.',
        definitionEn: 'A flexible metallic accordion sleeve that isolates the stem and prevents all fugitive leakage.'
      }
    ],
    keyTakeaways: [
      'Áp dụng chứng chỉ ISO 15848-1 cho các dự án nhà máy hóa chất và kho cảng dầu khí.',
      'Yêu cầu chứng chỉ kiểm định xuất xưởng EN 10204 Type 3.1 cho từng lô hàng van.',
      'Van đệm mềm UTD luôn cam kết độ kín bọt khí tuyệt đối ISO 5208 Rate A.'
    ],
    keyTakeawaysEn: [
      'Specify ISO 15848-1 Class AH for toxic gas and volatile hydrocarbon loops.',
      'Demand EN 10204 Type 3.1 material test certificates for critical piping packages.',
      'UTD soft-seated valves deliver bubble-tight ISO 5208 Rate A performance.'
    ],
    recommendedValveCodes: ['UTD-BV-HP', 'UTD-BF-TOV-300', 'UTD-GL-300']
  }
];

const VALVE_NEWS_STORAGE_KEY = 'utd_valve_news_articles_v2';

export function getStoredValveArticles(): ValveNewsArticle[] {
  try {
    const raw = localStorage.getItem(VALVE_NEWS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading valve news articles:', err);
  }
  return VALVE_NEWS_ARTICLES;
}

export function saveStoredValveArticles(articles: ValveNewsArticle[]): void {
  try {
    localStorage.setItem(VALVE_NEWS_STORAGE_KEY, JSON.stringify(articles));
  } catch (err) {
    console.warn('Error saving valve news articles:', err);
  }
}

export function addValveNewsArticle(newArticle: ValveNewsArticle): ValveNewsArticle[] {
  const current = getStoredValveArticles();
  const filtered = current.filter(a => a.id !== newArticle.id);
  const updated = [newArticle, ...filtered];
  saveStoredValveArticles(updated);
  return updated;
}
