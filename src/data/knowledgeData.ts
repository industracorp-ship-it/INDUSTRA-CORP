export interface KnowledgeTopic {
  id: string;
  category: 'pccc' | 'steam' | 'cross_ref' | 'hp_butterfly';
  title: string;
  titleEn: string;
  subtitle: string;
  summary: string;
  iconName: string;
  badge: string;
  sections: {
    heading: string;
    content: string;
    specsOrSteps?: string[];
    diagramLabel?: string;
  }[];
}

export const FIRE_FIGHTING_KNOWLEDGE: KnowledgeTopic[] = [
  {
    id: 'pccc-deluge-preaction',
    category: 'pccc',
    title: 'Hệ Thống Van Xả Tràn (Deluge Valve) & Hệ Pre-Action',
    titleEn: 'Deluge & Pre-Action Fire Valve Systems',
    subtitle: 'Nguyên lý kích hoạt kép, van màng áp lực và tủ điều khiển xả tràn cho khu vực nguy cơ cháy nổ cao',
    summary: 'Hệ thống van xả tràn Deluge và Pre-action là giải pháp cốt lõi cho nhà máy hóa chất, kho sơn, trạm biến áp và trung tâm dữ liệu (Data Center). Thiết kế ngăn chặn kích hoạt giả và cấp nước đồng loạt.',
    iconName: 'Flame',
    badge: 'UL/FM Certified',
    sections: [
      {
        heading: '1. Cấu tạo & Nguyên lý Van Xả Tràn (Deluge Valve)',
        content: 'Van xả tràn UTD-DLG sử dụng màng ngăn cao su EPDM cốt vải bố gia cường. Trong trạng thái sẵn sàng, áp lực nước mồi trong buồng màng (diaphragm chamber) giữ nắp van đóng chặt. Khi hệ thống báo cháy (đầu báo khói/nhiệt hoặc nút ấn khẩn cấp) phát tín hiệu, van điện từ Solenoid mở xả áp buồng màng, nước cấp ào ạt vào toàn bộ mạng lưới đầu phun hở (Open Sprinklers).',
        specsOrSteps: [
          'Áp suất làm việc: PN16 (1.6 MPa) / PN25',
          'Phương thức kích hoạt: Điện (Solenoid 24VDC), Khí nén (Pneumatic Pilot), hoặc Cơ tay khẩn cấp (Manual Release)',
          'Tích hợp Chuông nước cơ khí (Water Motor Alarm) reo to không cần điện khi van mở',
          'Công tắc áp lực (Pressure Switch) gửi tín hiệu xác nhận dòng chảy về Tủ trung tâm'
        ]
      },
      {
        heading: '2. Hệ Thống Kích Hoạt Sớm Pre-Action (Bảo vệ Trung tâm dữ liệu)',
        content: 'Hệ thống Pre-action ngăn chặn tối đa rủi ro vỡ đường ống làm hư hỏng máy chủ server. Đường ống sau van được nạp khí nén áp lực thấp (0.5 - 1.5 Bar) để giám sát rò rỉ. Van chỉ cấp nước khi đồng thời xảy ra 2 điều kiện: Đầu báo cháy điện tử kích hoạt VÀ đầu phun sprinkler nổ vỡ bóng thủy tinh.',
        specsOrSteps: [
          'Single Interlock: Kích hoạt khi có tín hiệu báo cháy điện tử',
          'Double Interlock: Cần đồng thời tín hiệu báo cháy VÀ sụt áp khí nén đường ống mới mở nước',
          'Tiêu chuẩn tham chiếu: NFPA 13, NFPA 15, TCVN 7336:2021'
        ]
      }
    ]
  },
  {
    id: 'pccc-alarm-angle-prv',
    category: 'pccc',
    title: 'Van Báo Động, Van Góc Cứu Hỏa & Van Giảm Áp PCCC',
    titleEn: 'Alarm Check, Fire Angle & Pressure Regulating Valves',
    subtitle: 'Kiểm soát cột áp đường ống chữa cháy cho nhà cao tầng và cụm van chữa cháy vách tường',
    summary: 'Bộ ba thiết bị thiết yếu trong mạng lưới chữa cháy ướt: Van báo động tự động reo chuông cơ khí, Van giảm áp giữ áp suất vòi rồng không quá 7 Bar theo quy chuẩn PCCC, và Van góc đồng/gang nối khớp ngàm ngàm Storz/TCVN.',
    iconName: 'ShieldAlert',
    badge: 'TCVN 3890 / NFPA',
    sections: [
      {
        heading: '1. Van Báo Động (Alarm Check Valve - Wet Pipe System)',
        content: 'Lắp đặt tại chân các trục đứng chữa cháy. Van hoạt động như van một chiều ngăn nước chảy ngược, đồng thời có cổng trích tín hiệu kết nối Bình làm chậm (Retard Chamber) để lọc áp suất đột biến, tránh báo động giả. Khi có 1 đầu sprinkler vỡ, cánh van mở liên tục đưa nước vào chuông thủy lực phát còi báo động.',
        specsOrSteps: [
          'Cỡ van tiêu chuẩn: DN80, DN100, DN150, DN200',
          'Cấp áp suất: PN16, PN25',
          'Thời gian phản hồi chuông nước: 5 - 15 giây sau khi lưu lượng ổn định'
        ]
      },
      {
        heading: '2. Van Giảm Áp PCCC Trục Đứng Tầng Cao (Pressure Reducing Valve)',
        content: 'Theo quy chuẩn TCVN 3890 và NFPA 14, áp lực tại họng chữa cháy vách tường của lính cứu hỏa không được vượt quá 7 Bar (để tránh giật văng cuộn vòi gây nguy hiểm) và không thấp hơn 4.5 Bar. Van giảm áp thủy lực UTD tự động triệt tiêu cột áp tĩnh 15 - 25 Bar từ tầng 30 xuống mức 5 - 6 Bar ổn định.',
        specsOrSteps: [
          'Pilot điều áp dạng màng nhạy bén với độ trễ < 0.2 Bar',
          'Đồng hồ đo áp suất trước và sau van gắn liền',
          'Có cơ cấu chống kẹt cặn và lưới lọc inox bảo vệ pilot'
        ]
      },
      {
        heading: '3. Van Góc Vách Tường (Fire Angle Hose Valve) & Đầu Phun Sprinkler',
        content: 'Van góc UTD thân đồng mạ chrome hoặc gang cầu đĩa cao su bọc đồng, tay vặn chữ T chịu lực cao, đầu ra ren hoặc khớp nối ngàm nhôm tiêu chuẩn Việt Nam. Đầu phun Sprinkler UTD đạt hệ số K=5.6, K=8.0, K=11.2 (ESFR kho hàng trên cao) với bóng thủy tinh chịu nhiệt độ kích nổ 68°C (đỏ), 79°C (vàng), 93°C (xanh lá).',
        specsOrSteps: [
          'Đầu phun Sprinkler: Hướng lên (Upright), Hướng xuống (Pendent), Gắn tường (Sidewall)',
          'Van xả khí tự động (Air Release Valve) lắp đỉnh trục đứng PCCC loại bỏ túi khí nén',
          'Van an toàn xả áp hồi về bể (Pressure Relief) bảo vệ khi máy bơm đề-pa'
        ]
      }
    ]
  },
  {
    id: 'pccc-shotgun-riser-vs-alarm-check',
    category: 'pccc',
    title: 'Phân Tích So Sánh: Shotgun Riser Manifold vs Alarm Check Valve PCCC',
    titleEn: 'Engineering Comparison: Shotgun Riser Check Manifold vs Alarm Check Valve System',
    subtitle: 'Tổng hợp tri thức chuyên sâu từ Tyco, Viking, Reliable, Victaulic, Shield Valve & UTD Fire Protection',
    summary: 'Phân tích đa chiều giữa Cụm van trục đứng Shotgun Riser (Floor Control / Riser Manifold) và Van báo động ướt Alarm Check Valve: Nguyên lý dập báo động giả, không gian lắp đặt hộp gen kỹ thuật, kiểm định NFPA 13 và tối ưu chi phí đầu tư.',
    iconName: 'Layers',
    badge: 'NFPA 13 / UL-FM Multi-Brand',
    sections: [
      {
        heading: '1. Khái Niệm & Cấu Trúc: Shotgun Riser Là Gì và Khác Gì Alarm Check Valve?',
        content: 'Cụm Shotgun Riser (thường được gọi là Floor Control Assembly hoặc Shotgun Riser Check Manifold) là cụm van tích hợp đúc sẵn hoặc kết nối cùm rãnh Grooved cực kỳ tinh gọn bao gồm: (1) Van bướm tín hiệu điện giám sát (Supervised Butterfly Valve kèm công tắc hành trình Tamper Switch), (2) Van một chiều cánh lật cao tốc (Riser Check Valve / Shotgun Check), (3) Công tắc dòng chảy cánh chèo (Waterflow Detector có bộ đếm giờ trễ cơ-điện 0-90 giây), (4) Cụm van xả thử nghiệm thanh tra (Inspector\'s Test & Drain Valve có lỗ đo K-factor chuẩn), và (5) Đồng hồ đo áp lực nước. Ngược lại, Cụm Alarm Check Valve (Wet Alarm Valve) là một khối van một chiều lớn có rãnh trích tín hiệu thủy lực (Annular Groove Seat Ring), bình làm chậm cơ học (Retard Chamber) và chuông nước cơ khí (Water Motor Alarm Gong) reo bằng sức nước không cần cấp điện.',
        specsOrSteps: [
          'Shotgun Riser: Thiết kế tối ưu cho kiểm soát từng tầng (Floor Zone Control), khối văn phòng, trung tâm thương mại và chung cư cao tầng',
          'Alarm Check Valve: Phù hợp đặt tại chân trục đứng cấp nước chính từ phòng bơm trung tâm bảo vệ toàn bộ khối tòa nhà',
          'Shotgun Riser loại bỏ bình làm chậm cồng kềnh nhờ sử dụng Flow Switch điện tử trễ dòng chảy',
          'Khả năng kiểm tra thử nghiệm định kỳ: Shotgun Riser tích hợp sẵn vị trí Test & Drain mô phỏng chính xác lưu lượng của 1 đầu sprinkler'
        ]
      },
      {
        heading: '2. Tổng Hợp Tri Thức Kỹ Thuật Từ Các Hãng Van Hàng Đầu Thế Giới',
        content: 'AI đã tổng hợp dữ liệu kỹ thuật từ catalogue và tài liệu bảo trì của các nhà sản xuất van PCCC hàng đầu toàn cầu:',
        specsOrSteps: [
          'Tyco / Johnson Controls (USA): Dòng Model AV-1-300 Alarm Check Valve kết hợp bình RC-1 Retard Chamber là tiêu chuẩn công nghiệp cho trạm bơm chính. Đối với từng tầng, Tyco phát triển cụm Model CR-1 / Model RM-1 Riser Manifold đúc nguyên khối giúp giảm 80% mối nối ren.',
          'Viking (USA): Model J-1 Alarm Valve ứng dụng màng ngăn cao su đúc nguyên khối chống kẹt cặn. Viking đối chiếu với cụm EasyRiser Check Valve có thân đúc chữ Y nhỏ gọn tối ưu cho các hộp gen kỹ thuật chật hẹp.',
          'Reliable (USA): Model E3 Wet Alarm Valve và cụm Commercial Riser Assembly (Model CR) tích hợp đĩa nêm van một chiều chịu mài mòn, đạt áp suất làm việc 300 PSI (20.7 Bar).',
          'Victaulic (USA): Series 751 FireLock Alarm Check Valve và Series 747M FireLock Riser Check Manifold nổi tiếng với khớp nối rãnh cơ khí lắp đặt siêu tốc chỉ mất 1/3 thời gian so với van nối bích truyền thống.',
          'UTD Fire Protection: Dòng UTD-SGR16 (Shotgun Riser Manifold) sản xuất theo tiêu chuẩn UL/FM, thân gang cầu GGG50 phủ sơn Epoxy đỏ chuyên dụng, tích hợp van xả khí và đồng hồ đo áp kép.'
        ]
      },
      {
        heading: '3. Bảng So Sánh Kỹ Thuật Chi Tiết (Matrix: Shotgun Riser vs Alarm Check)',
        content: 'Bảng đối chiếu 6 thông số kỹ thuật cốt lõi giúp kỹ sư cơ điện M&E và nhà thầu EPC lựa chọn chính xác cho dự án:',
        specsOrSteps: [
          'Không gian lắp đặt (Footprint): Shotgun Riser chiếm diện tích nhỏ hơn 65% so với cụm Alarm Check Valve kèm chuông nước và ống bypass trích xả',
          'Cơ chế chống báo động giả: Alarm Check dựa vào bình Retard Chamber nạp đầy nước mới kích hoạt; Shotgun Riser dùng vi mạch hoặc rơ-le khí nén làm chậm 0-90 giây trên Flow Switch',
          'Chuông báo động: Alarm Check dùng chuông cơ khí Water Motor Gong không phụ thuộc nguồn điện dự phòng; Shotgun Riser kích hoạt còi điện tử qua hệ thống BMS / tủ báo cháy',
          'Bảo trì & Xả thử: Shotgun Riser cho phép cô lập và xả thử nghiệm tầng riêng biệt mà không ảnh hưởng áp lực nước của các tầng khác',
          'Chi phí lắp đặt: Shotgun Riser tiết kiệm 35% chi phí nhân công lắp đặt và phụ kiện đường ống so với hệ Alarm Check truyền thống',
          'Quy chuẩn tham chiếu: NFPA 13 (Mục 8.16.1 & 16.9.11), NFPA 14, TCVN 7336:2021, UL 193 / FM 1020'
        ]
      }
    ]
  },
  {
    id: 'pccc-gas-suppression',
    category: 'pccc',
    title: 'Hệ Thống Chữa Cháy Bằng Khí (FM-200, Novec 1230, CO2, IG-541)',
    titleEn: 'Gas Suppression Valves & Central Control Panels',
    subtitle: 'Tủ điều khiển xả khí trung tâm, van kích hoạt bình khí và đầu phun khuếch tán khí',
    summary: 'Hệ thống dập tắt đám cháy không dùng nước bảo vệ trọn vẹn phòng điện tử, phòng biến áp, thư viện tư liệu và phòng server cao cấp.',
    iconName: 'Wind',
    badge: 'Clean Agent NFPA 2001',
    sections: [
      {
        heading: '1. Khí Sạch FM-200 (HFC-227ea) & Novec 1230 (FK-5-1-12)',
        content: 'Khí sạch dập tắt đám cháy bằng cơ chế làm mát hấp thụ nhiệt và cắt chuỗi phản ứng cháy, không dẫn điện, không để lại cặn bẩn, an toàn cho con người khi thoát hiểm. Bình chứa thép đúc áp lực 25 Bar / 42 Bar trang bị Cụm van đầu bình (Cylinder Valve) có màng nổ an toàn và van kích hoạt điện/khí.',
        specsOrSteps: [
          'Thời gian xả khí đạt nồng độ dập cháy: Dưới 10 giây',
          'Van điều hướng vùng (Selector Valve) dùng cho 1 dàn bình bảo vệ nhiều phòng',
          'Đầu phun khí 360° và 180° tính toán tiết diện theo phần mềm thủy lực đạt chuẩn'
        ]
      },
      {
        heading: '2. Khí Trơ Nitơ (IG-100) & Khí Hỗn Hợp IG-541 (Inergen)',
        content: 'Hệ thống khí trơ bảo vệ môi trường hoàn hảo (ODP=0, GWP=0), dập lửa bằng cách hạ nồng độ Oxy trong phòng kín từ 21% xuống 12 - 14% (mức đám cháy tự tắt nhưng con người vẫn thở được an toàn). Áp suất nén trong bình cao (200 - 300 Bar), yêu cầu van đầu bình bằng đồng rèn nguyên khối có tích hợp van tiết lưu giảm áp ổn định áp lực xả.',
        specsOrSteps: [
          'Áp suất bình chứa: 200 Bar / 300 Bar',
          'Van xả áp quá dòng (Overpressure Flap Damper) bảo vệ kết cấu tường phòng',
          'Đường ống thép đúc SCH40 / SCH80 hàn nối bích chịu áp cao'
        ]
      },
      {
        heading: '3. Tủ Trung Tâm Điều Khiển Xả Khí (Gas Release Control Panel)',
        content: 'Tủ xả khí hoạt động theo nguyên lý Cross-Zone Detection (chữ thập kép). Chỉ khi đồng thời cả 2 kênh đầu báo cháy (Zone 1 - Khói và Zone 2 - Nhiệt) cùng báo động, tủ mới đếm ngược 30 giây (thời gian di tản) và kích nguồn 24VDC mở van Solenoid bình kích hoạt.',
        specsOrSteps: [
          'Nút ấn dừng xả khẩn cấp (Emergency Abort Switch) trì hoãn đếm ngược',
          'Nút ấn xả khí bằng tay (Manual Release Station) ghi đè tức thì',
          'Chuông còi đèn chớp cảnh báo sơ tán lối cửa ra vào'
        ]
      }
    ]
  }
];

export const STEAM_KNOWLEDGE: KnowledgeTopic[] = [
  {
    id: 'steam-traps-principles',
    category: 'steam',
    title: 'Bẫy Hơi Nước Ngưng (Steam Traps): Phao Cơ, Đồng Tiền & Nhiệt Tĩnh',
    titleEn: 'Steam Traps: Float, Thermodynamic & Thermostatic',
    subtitle: 'Nguyên lý bẫy xả nước ngưng, ngăn thất thoát hơi nóng và chống búa nước đường ống',
    summary: 'Bẫy hơi là trái tim của hệ thống nhiệt. Lựa chọn sai chủng loại bẫy hơi có thể làm tổn thất 20 - 30% sản lượng hơi của lò hơi và gây hiện tượng thủy kích phá hủy đường ống.',
    iconName: 'Gauge',
    badge: 'Energy Saving',
    sections: [
      {
        heading: '1. Bẫy Hơi Phao Cơ (Ball Float Trap - Fig. TSF-14F)',
        content: 'Hoạt động hoàn toàn theo nguyên lý chênh lệch khối lượng riêng giữa nước và hơi. Khi nước ngưng chảy vào thân bẫy, quả phao inox nổi lên mở van xả liên tục ở nhiệt độ sôi mà không để hơi nóng thoát ra. Rất phù hợp cho các thiết bị trao đổi nhiệt, dàn sấy, nồi nấu công nghiệp cần truyền nhiệt ổn định.',
        specsOrSteps: [
          'Tích hợp màng nhiệt tĩnh xả khí tự động (Air Vent) chống đọng túi khí nguội',
          'Khả năng xả nước ngưng liên tục với lưu lượng từ 150 kg/h đến 10.000 kg/h',
          'Vật liệu thân: Gang dẻo GGG40.3 hoặc Thép đúc WCB chịu nhiệt 300°C'
        ]
      },
      {
        heading: '2. Bẫy Hơi Đồng Tiền Nhiệt Động (Thermodynamic Trap - Fig. TD42)',
        content: 'Hoạt động dựa trên định luật Bernoulli về vận tốc dòng chảy và áp suất động của hơi nước. Đĩa van đồng tiền inox di chuyển đóng mở nhấp nhả. Thiết kế cực kỳ nhỏ gọn, chịu va đập búa nước và không bị ảnh hưởng bởi hiện tượng đóng băng ngoài trời.',
        specsOrSteps: [
          'Chuyên dụng cho xả nước ngưng trên đường ống dẫn hơi chính (Main Steam Header Drip Legs)',
          'Áp suất làm việc tối đa: PN40, PN63 (Lên tới 42 Bar)',
          'Có nắp chụp cách nhiệt chống đọng sương do thời tiết mưa gió'
        ]
      }
    ]
  },
  {
    id: 'steam-pressure-reducing-safety',
    category: 'steam',
    title: 'Trạm Giảm Áp Hơi Nóng & Van An Toàn Lò Hơi',
    titleEn: 'Steam Pressure Reducing Station & Safety Relief Valves',
    subtitle: 'Điều áp tuyến tính pilot màng và van an toàn lò hơi xả toàn phần chuẩn ASME Section I & VIII',
    summary: 'Giải pháp kiểm soát áp suất và bảo vệ quá áp tối thượng cho lò hơi công nghiệp, nhà máy dệt may, sấy gỗ, bia rượu và chế biến thực phẩm.',
    iconName: 'Sliders',
    badge: 'ASME Sec I/VIII',
    sections: [
      {
        heading: '1. Van Giảm Áp Hơi Dạng Pilot Màng (Pilot Operated PRV - Fig. Y43H)',
        content: 'Khác với van giảm áp tác động trực tiếp, van pilot màng UTD có độ chính xác điều áp cực cao (+/- 0.1 Bar) bất kể áp suất đầu vào biến động hoặc phụ tải hơi tiêu thụ thay đổi đột ngột. Cụm màng inox đôi cảm ứng nhạy bén điều khiển piston chính dịch chuyển nhịp nhàng.',
        specsOrSteps: [
          'Dải áp đầu vào: Lên tới 25 Bar / 40 Bar; Áp đầu ra: 0.5 - 16 Bar',
          'Đĩa và ghế van tôi cứng bằng hợp kim Stellite chống hiện tượng xé rách do dòng hơi tốc độ cao (wire drawing)',
          'Lắp đặt kèm Y-Strainer lưới inox mịn 100 mesh phía trước để bảo vệ đường dẫn pilot'
        ]
      },
      {
        heading: '2. Van An Toàn Lò Hơi Xả Toàn Phần (Full Bore Safety Valve)',
        content: 'Thiết bị bảo vệ sự sống và tài sản của nhà máy khi lò hơi gặp sự cố quá áp. Đĩa van nâng toàn phần (Full lift) cho phép xả lưu lượng hơi cực đại ngay khi áp suất vượt 3% áp cài đặt (Set pressure), đóng lại dứt khoát khi áp hạ xuống 90 - 95%.',
        specsOrSteps: [
          'Vật liệu thân: Thép đúc WCB hoặc Thép hợp kim WC6 chịu nhiệt 450°C',
          'Có tay giật kiểm tra định kỳ (Lifting Lever) theo quy định an toàn lao động',
          'Hiệu chuẩn và kẹp chì kiểm định theo TCVN 6155 / ASME Section I'
        ]
      }
    ]
  }
];

export const CROSS_REFERENCE_INTELLIGENCE = [
  {
    brand: 'Johnson Controls / Penn / York',
    brandOrigin: 'Hoa Kỳ (USA)',
    equivalentProducts: [
      {
        competitorModel: 'Johnson Controls VG7000 Series (Van điều khiển điện tuyến tính đồng/gang)',
        utdModel: 'Fig. CV-300 Modulating Control Valve (Van điều khiển điện tuyến tính 0-10V / 4-20mA)',
        advantage: 'Hệ số Kvs tương đương 100%, tích hợp actuator thông minh hiển thị hành trình % trực quan, thời gian đóng mở nhanh hơn 15%, giá thành tối ưu hơn 30-40%.',
        suitableApps: 'Hệ thống AHU, FCU, Chiller HVAC tòa nhà, bộ trao đổi nhiệt nước nóng.'
      },
      {
        competitorModel: 'Johnson Controls VF Series (Van bướm điều khiển điện On/Off & Modulating)',
        utdModel: 'Fig. H401 Series (Van bướm lệch tâm đệm EPDM/Inox gắn Actuator điện IP67)',
        advantage: 'Mô-men xoắn đóng mở nhẹ hơn nhờ cấu trúc đĩa lệch tâm kép, tuổi thọ đệm kín cao hơn, sẵn sàng giao hàng ngay tại kho.',
        suitableApps: 'Trạm bơm giải nhiệt cooling tower, đường ống Chilled Water trung tâm.'
      }
    ]
  },
  {
    brand: 'Spirax Sarco',
    brandOrigin: 'Anh Quốc (UK)',
    equivalentProducts: [
      {
        competitorModel: 'Spirax Sarco FT14 / FT43 (Bẫy hơi phao gang dẻo ren & bích)',
        utdModel: 'Fig. TSF-14F (Bẫy hơi phao cơ gang cầu GGG40.3 nối bích PN16)',
        advantage: 'Tương đồng hoàn toàn về kích thước kết nối Face-to-Face chuẩn DIN, màng xả khí nhiệt tĩnh bimetal độ bền cao, bi phao inox 304 dày hơn chống móp búa nước.',
        suitableApps: 'Bộ sấy calorifer dệt may, nồi nấu thực phẩm, giàn trao đổi nhiệt công nghiệp.'
      },
      {
        competitorModel: 'Spirax Sarco TD42 / TD52 (Bẫy hơi đồng tiền nhiệt động PN40/PN63)',
        utdModel: 'Fig. TD42 (Bẫy hơi nhiệt động thân inox rèn/thép WCB đĩa tôi cứng)',
        advantage: 'Bề mặt đồng tiền và ghế van mài bóng quang học siêu phẳng, ngăn rò rỉ hơi sống, chi phí thay thế lõi phụ tùng tiết kiệm 45%.',
        suitableApps: 'Bẫy nước ngưng tuyến ống chính nhà máy nhiệt điện, dệt, thức ăn chăn nuôi.'
      },
      {
        competitorModel: 'Spirax Sarco DP27 / 25P (Van giảm áp hơi nóng dạng pilot màng)',
        utdModel: 'Fig. Y43H (Van giảm áp hơi nóng màng thép WCB đĩa Stellite)',
        advantage: 'Cơ cấu pilot độc lập dễ vệ sinh bảo trì, màng van inox đôi đàn hồi cao kiểm soát áp suất đầu ra ổn định +/- 0.1 bar, phụ tùng pilot có sẵn.',
        suitableApps: 'Trạm giảm áp lò hơi phân xưởng may, nhuộm, giặt là, sấy gỗ.'
      }
    ]
  },
  {
    brand: 'Keystone / Vanessa / Tyco',
    brandOrigin: 'USA & Thụy Sĩ',
    equivalentProducts: [
      {
        competitorModel: 'Vanessa Series 30,000 (Van bướm lệch tâm ba Triple Offset Metal Seated)',
        utdModel: 'Fig. H401 / H402 Series (Van bướm hiệu suất cao Triple-Offset 1.000.000 Cycles)',
        advantage: 'Cơ cấu lệch tâm ba hình nón xiên triệt tiêu ma sát trượt, đạt chuẩn kín khí tuyệt đối Bubble-Tight MSS-SP61, chịu lạnh âm sâu LNG -196°C và hơi nóng quá nhiệt 450°C, chứng chỉ chống cháy API 607.',
        suitableApps: 'Khí Oxy công nghiệp (ASTM G93 Clean), kho lạnh LNG, hơi bão hòa nhiệt điện.'
      },
      {
        competitorModel: 'Keystone Fig. GRW / GRL (Van bướm đồng tâm thân gang đĩa bọc cao su)',
        utdModel: 'Fig. 401G / G-401G (Van bướm Wafer/Lug đĩa Inox CF8M gioăng EPDM/PTFE)',
        advantage: 'Cổ van đúc cao thuận tiện bọc vật liệu cách nhiệt bảo ôn, đĩa van Inox đánh bóng giảm mô men xoắn đóng mở 25%, phụ tùng thay thế sẵn có.',
        suitableApps: 'Trạm xử lý nước sạch đô thị, tháp giải nhiệt cooling tower, nhà máy hóa chất.'
      }
    ]
  },
  {
    brand: 'Valmet (Neles™ & Jamesbury™)',
    brandOrigin: 'Phần Lan & Hoa Kỳ (Finland & USA)',
    equivalentProducts: [
      {
        competitorModel: 'Valmet Neles™ Neldisc™ Series L6, LW, LG & Jamesbury™ Wafer-Sphere™ 815/830 (High Performance Butterfly Valves)',
        utdModel: 'Fig. H401 & Fig. H402 Series (Van Bướm Hiệu Suất Cao Triple-Offset UTD)',
        advantage: 'Ứng dụng toàn bộ nguyên lý thiết kế lệch tâm kép và lệch tâm ba đạt chuẩn ISO 5208 Rate A Bubble-tight, kết cấu đệm kim loại tôi cứng chịu ma mòn cao trong bột giấy và hơi quá nhiệt 450°C, đệm cổ ty van Live-loaded packing đạt chuẩn phát thải khí quyển ISO 15848-1 Class AH.',
        suitableApps: 'Công nghiệp Bột giấy & Giấy (Pulp & Paper), Hơi quá nhiệt lò hơi, Hóa dầu, Khí lạnh âm sâu LNG -196°C, Khí Oxy sạch.'
      }
    ]
  },
  {
    brand: 'Armstrong International',
    brandOrigin: 'USA (Hoa Kỳ)',
    equivalentProducts: [
      {
        competitorModel: 'Armstrong Model 800 / 811 / 880 (Bẫy hơi gầu đảo Inverted Bucket)',
        utdModel: 'Fig. TD42 & TSF-14F (Bẫy hơi phao đúc thép & đồng tiền nhiệt động)',
        advantage: 'Cơ cấu xả nước ngưng tự động không ngậm hơi nóng (Zero Steam Loss), phao inox tôi cứng chống chịu lực giật búa nước cực đại.',
        suitableApps: 'Bẫy nước ngưng tuyến ống chính hơi nóng, dàn sấy sấy gỗ/dệt may, nồi hấp tiệt trùng.'
      },
      {
        competitorModel: 'Armstrong Float & Thermostatic F&T Traps (Bẫy hơi phao nhiệt tĩnh)',
        utdModel: 'Fig. TSF-14F (Bẫy hơi phao cơ gang dẻo/thép đúc xả liên tục)',
        advantage: 'Tích hợp màng xả khí bimetal xả nhanh toàn bộ khí lạnh khi khởi động lò hơi, công suất xả nước ngưng liên tục lên tới 50.000 kg/h.',
        suitableApps: 'Bộ trao đổi nhiệt dạng tấm, calorifer sấy không khí, thiết bị cô đặc chân không.'
      }
    ]
  },
  {
    brand: 'KSB / Crane / Saunders',
    brandOrigin: 'Đức & Anh Quốc (Germany & UK)',
    equivalentProducts: [
      {
        competitorModel: 'KSB BOA-H / BOA-Compact (Van cầu hơi Bellows Seal nắp ống xếp)',
        utdModel: 'Fig. 303DF / 301DF (Van cầu hơi ống xếp Inox 316Ti TA-Luft)',
        advantage: 'Màng ống xếp kim loại inox 2 lớp triệt tiêu 100% rò rỉ qua trục van ra môi trường, đạt chuẩn khí thải của Đức TA-Luft, không cần bảo trì châm dầu graphite.',
        suitableApps: 'Hơi nóng bão hòa áp cao PN25/PN40, hệ thống dầu truyền nhiệt bảo vệ môi trường.'
      },
      {
        competitorModel: 'Crane Fig. D151 / D298 (Van một chiều cánh lật & van cổng đồng/gang)',
        utdModel: 'Fig. 400DEF & Fig. 201DF (Van 1 chiều lá lật cao su & van cửa ty chìm)',
        advantage: 'Cánh lá lật nghiêng 45° đóng siêu êm không gây búa nước, giá thành tối ưu cho gói thầu cơ điện MEP dự án cao tầng.',
        suitableApps: 'Phòng bơm tăng áp tầng hầm, cụm van điều khiển trạm bơm chiller giải nhiệt.'
      }
    ]
  }
];

/**
 * COMPREHENSIVE HIGH PERFORMANCE BUTTERFLY VALVE DOCUMENTATION
 * Provided by UTDCORP Flow Technology & Engineering Research Institute
 * Reference: UTDCORP Engineering Manual (utdcorp.com)
 */
export const HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE = {
  title: 'Cẩm Nang Kỹ Thuật Van Bướm Hiệu Suất Cao UTDCORP (High Performance Butterfly Valve - HPBV)',
  titleEn: 'Comprehensive UTDCORP High Performance Butterfly Valve Engineering & IOM Manual',
  sourceCredit: 'Nguồn và tài liệu kỹ thuật độc quyền do UTDCORP cung cấp - Viện Nghiên Cứu Công Nghệ Dòng Chảy & Van Công Nghiệp UTDCORP (utdcorp.com)',
  sourceUrl: 'https://utdcorp.com',
  summary: 'Cẩm nang toàn diện tích hợp tài liệu hướng dẫn sử dụng, quy trình lắp đặt chuẩn công nghiệp, nguyên tắc vận hành, môi chất ứng dụng và ma trận bảo trì khắc phục sự cố cho dòng Van Bướm Hiệu Suất Cao UTD (Fig. H401 & Fig. H402 Series) do UTDCORP cung cấp và kiểm định độc quyền.',
  
  keyStats: [
    { label: 'Tuổi thọ chu trình vận hành', value: '1.000.000+', desc: 'Chu trình đóng mở không rò rỉ theo kiểm nghiệm chu kỳ' },
    { label: 'Cấp độ kín khít rò rỉ', value: 'ISO 5208 Rate A', desc: 'Bubble-Tight zero bubble khí nén & ANSI FCI 70-2 Class VI' },
    { label: 'Dải nhiệt độ chịu đựng', value: '-196°C ~ +450°C', desc: 'Từ khí LNG âm sâu đến hơi quá nhiệt nhiệt điện' },
    { label: 'Tiết kiệm không gian & tải trọng', value: 'Giảm 65%', desc: 'So với van cổng hoặc van bi cùng cỡ DN200 - DN1200' }
  ],

  offsetExplanation: [
    {
      title: 'Lệch tâm thứ nhất (First Offset - Shaft behind seat plane):',
      detail: 'Trục van nằm dịch chuyển lùi về phía sau so với mặt phẳng làm kín của đĩa van, tạo không gian cho bề mặt đệm kín liên tục 360° không bị đục lỗ xuyên qua đĩa, đảm bảo đệm làm kín nguyên khối toàn diện.'
    },
    {
      title: 'Lệch tâm thứ hai (Second Offset - Shaft eccentric to pipe axis):',
      detail: 'Tâm trục van nằm lệch sang một bên so với đường tâm hình học của đường ống. Nhờ vậy, ngay trong 1-2 độ mở đầu tiên, đĩa van lập tức tách rời hoàn toàn khỏi bề mặt đệm (camming action), triệt tiêu ma sát trượt bào mòn trong suốt 88 độ hành trình còn lại.'
    },
    {
      title: 'Lệch tâm thứ ba (Triple Offset - Conical seal geometry):',
      detail: 'Mặt côn làm kín được gia công nghiêng một góc hình nón xiên (inclined conical seat angle). Khi đóng, đĩa van tiếp xúc với ghế van như một cái nêm khít hoàn hảo không trượt cơ khí, triệt tiêu mài mòn, tạo lực siết kín đồng đều và đạt chuẩn chống cháy Fire-Safe API 607 / ISO 10497.'
    }
  ],

  // 1. Media & Industrial Applications Guide (Môi chất sử dụng theo chuẩn UTDCORP)
  industrialApplications: [
    {
      sectorVi: 'Công nghiệp Giấy & Bột Giấy (Pulp & Paper - Thế mạnh cốt lõi của UTDCORP)',
      sectorEn: 'Pulp & Paper Processing (UTDCORP Core Competency Standard)',
      suitableMedia: [
        'Bột giấy huyền phù (Pulp slurries với nồng độ bột khô lên tới 4 - 5% consistency)',
        'Dịch đen cô đặc (Black liquor) trong chu trình thu hồi hóa chất kiềm lò hơi',
        'Dịch trắng (White liquor) và dịch xanh (Green liquor)',
        'Dung dịch tẩy trắng chứa ClO2 (Chlorine Dioxide - dùng thân Inox CF8M / Titanium / Duplex)',
        'Dung dịch xút ăn da NaOH 30 - 50% ở nhiệt độ cao'
      ],
      recommendedTrimVi: 'Thân đúc Inox CF8M hoặc Thép WCB, Đĩa van CF8M có lớp phủ Stellite hoặc niken tôi cứng mép cắt xơ, Đệm kim loại Inox 316 nhiều lớp hoặc PTFE gia cường.',
      valmetNoteVi: 'Dòng van UTD High Performance là giải pháp chuẩn mực do UTDCORP cung cấp cho các nhà máy sản xuất giấy nhờ khả năng tự gạt xơ sợi bột giấy mà không bị nghẽn kẹt quanh trục.'
    },
    {
      sectorVi: 'Nhiệt Điện, Lò Hơi & Phân Phối Hơi Nóng (Power, Steam & Condensate)',
      sectorEn: 'Power Generation & High-Pressure Steam Distribution',
      suitableMedia: [
        'Hơi quá nhiệt (Superheated steam lên tới 400°C - 450°C, áp lực tới 40 bar)',
        'Hơi bão hòa tại các trạm phân phối chính (Main steam header)',
        'Nước ngưng áp lực cao (High-pressure condensate) có nguy cơ thủy kích',
        'Nước cấp lò hơi khử khí (Deaerator boiler feedwater)'
      ],
      recommendedTrimVi: 'Thân thép đúc WCB hoặc Thép hợp kim WC6/WC9, Đệm kim loại Laminated Inox 316 + Flexible Graphite chịu nhiệt 450°C, Trục van 17-4PH chống xoắn giật.',
      valmetNoteVi: 'Đệm kim loại đa tầng chịu được hiện tượng xé rách do dòng hơi tốc độ cao (wire drawing) và đạt kiểm định chống cháy API 607 do UTDCORP cung cấp và kiểm nghiệm.'
    },
    {
      sectorVi: 'Lọc Hóa Dầu, Khí Đốt & Hóa Chất (Refining, Petrochemical & Chemicals)',
      sectorEn: 'Hydrocarbon Processing, Refining & Aggressive Chemicals',
      suitableMedia: [
        'Hydrocarbon lỏng và khí gas tự nhiên, condensate',
        'Khí chua chứa H2S (Sour Gas) tuân thủ tiêu chuẩn luyện kim NACE MR0175 / ISO 15156',
        'Dung môi thơm: Benzen, Toluene, Xylen',
        'Axit sulfuric loãng, axit photphoric, bồn chứa hóa chất ăn mòn'
      ],
      recommendedTrimVi: 'Thân CF8M (Inox 316) hoặc Duplex 2205, Đệm mềm R-PTFE hoặc PEEK chịu áp cao, Cổ van Live-loaded packing đạt chuẩn phát thải khí quyển ISO 15848-1 Class AH.',
      valmetNoteVi: 'Dòng van UTD High Performance do UTDCORP cung cấp sở hữu cơ cấu đệm môi tự siết linh hoạt (flexible lip-seal) duy trì độ kín khí tuyệt đối khi nhiệt độ và áp suất dao động liên tục.'
    },
    {
      sectorVi: 'Khí Công Nghiệp & Lạnh Âm Sâu (Cryogenic & Industrial Gases)',
      sectorEn: 'Cryogenic Services & High Purity Industrial Gases',
      suitableMedia: [
        'Khí thiên nhiên hóa lỏng LNG (-162°C đến -196°C)',
        'Khí Oxy lỏng & khí Oxy sạch (Yêu cầu tẩy rửa khử dầu mỡ tiêu chuẩn ASTM G93 Level A/B)',
        'Khí Nitơ lỏng, Argon lỏng, Carbon Dioxide CO2',
        'Khí Hydro (H2 - yêu cầu vật liệu chống thấm hạt phân tử)'
      ],
      recommendedTrimVi: 'Cổ van vươn dài cách nhiệt (Extended Bonnet 150 - 300 mm) để đưa đệm cổ ty ra khỏi vùng đóng băng, Đệm Kel-F (PCTFE) hoặc Metal-to-metal.',
      valmetNoteVi: 'Vệ sinh và đóng gói chân không trong phòng sạch chuẩn Cleanroom do UTDCORP đảm bảo an toàn cháy nổ 100% trong môi trường Oxy tinh khiết.'
    },
    {
      sectorVi: 'Điều Hòa Trung Tâm Chiller & Nước Làm Mát (HVAC, District Cooling & Utilities)',
      sectorEn: 'HVAC Chiller Loops, District Cooling & Municipal Water',
      suitableMedia: [
        'Nước lạnh Chiller 5°C - 7°C trong các tòa nhà cao tầng và trung tâm dữ liệu',
        'Nước tuần hoàn giải nhiệt tháp Cooling Tower',
        'Hệ thống trữ lạnh băng (Thermal Ice Storage)'
      ],
      recommendedTrimVi: 'Cổ van đúc vươn dài cho phép bọc cách nhiệt Armaflex/Aeroflex dày 50mm, Thân gang cầu GGG50 hoặc WCB, Đĩa CF8M mài bóng gương, Đệm EPDM chịu lạnh chống đọng sương.',
      valmetNoteVi: 'Cổ dài cách nhiệt triệt tiêu hiện tượng cầu nhiệt (Thermal bridge) gây ngưng tụ đọng nước nhỏ giọt xuống trần kỹ thuật theo quy chuẩn UTDCORP.'
    }
  ],

  // 2. Installation Guidelines (Hướng dẫn lắp đặt chuẩn UTDCORP IOM)
  installationIOM: {
    safetyAndHandling: [
      {
        ruleVi: 'Quy tắc nâng hạ an toàn (Rigging & Hoisting)',
        detailVi: 'TUYỆT ĐỐI KHÔNG luồn cáp cẩu hoặc móc nâng vào bộ truyền động khí nén/điện (actuator), hộp số tay quay (gearbox), hoặc trục ty van. Chỉ được sử dụng dây đai vải nylon chịu lực vòng qua hai bên thân van hoặc bắt cùm nâng vào các lỗ mặt bích chuyên dụng.'
      },
      {
        ruleVi: 'Bảo quản trước khi lắp đặt (Storage & Protection)',
        detailVi: 'Van phải được lưu trữ trong nhà kho khô ráo, thoáng khí, tránh ánh nắng trực tiếp. Nắp bảo vệ mặt bích (flange covers) bằng nhựa hoặc gỗ dán phải được giữ nguyên cho tới thời điểm chuẩn bị đưa van vào giữa hai mặt bích đường ống để ngăn cát bụi và dị vật làm xước đệm kín.'
      },
      {
        ruleVi: 'Trạng thái đĩa van khi nâng chuyển (Disc Position During Rigging)',
        detailVi: 'Trong quá trình vận chuyển và cẩu nâng, đĩa van phải ở vị trí đóng gần kín (khoảng 3° - 5° mở hé để không ép đệm quá lâu nhưng không được để đĩa thò ra ngoài bề mặt bích thân van gây sứt mẻ mép đĩa khi va chạm).'
      }
    ],
    orientationGuidelines: [
      {
        ruleVi: 'Định hướng trục van (Shaft Orientation)',
        detailVi: 'Theo chuẩn kỹ thuật UTDCORP, khuyến nghị LẮP VAN VỚI TRỤC NẰM NGANG (Horizontal shaft orientation), đặc biệt trong các môi chất có lắng cặn, xơ sợi bột giấy hoặc bùn cát. Hướng trục nằm ngang cho phép dòng chảy tự cuốn trôi cặn lắng đáy ống, ngăn không cho cặn lọt vào ổ bi đỡ dưới và chèn ép đệm cổ ty van.'
      },
      {
        ruleVi: 'Cấm lắp đặt chúc đầu (Never Invert Actuator)',
        detailVi: 'CẤM TUYỆT ĐỐI lắp van với bộ chấp hành actuator chúc xuống phía dưới mặt đất (Actuator underneath pipe). Nếu có rò rỉ môi chất hoặc đọng sương ngưng tụ, chất lỏng sẽ chảy dồn thẳng vào cụm đệm cổ ty và bo mạch điều khiển điện tử, phá hủy thiết bị.'
      },
      {
        ruleVi: 'Đoạn ống thẳng tiêu chuẩn (Straight Pipe Runs)',
        detailVi: 'Cần bố trí đoạn ống thẳng tối thiểu 3 - 5 lần đường kính danh định (3 - 5 x DN) phía trước van và 2 - 3 x DN phía sau van khi lắp đặt sau máy bơm, co lơ hoặc van giảm áp để tránh dòng xoáy cục bộ gây rung lắc cánh van và sai số điều tiết lưu lượng.'
      }
    ],
    flowDirectionProtocol: [
      {
        ruleVi: 'Khả năng chịu áp hai chiều (Bidirectional Bubble-Tight Capability)',
        detailVi: 'Van bướm hiệu suất cao UTD đạt cấp kín khít hai chiều theo ISO 5208 Rate A. Tuy nhiên, van có "Hướng dòng ưu tiên" (Preferred Direction) được đánh dấu bằng mũi tên trên thân van để tối đa hóa tuổi thọ đệm kín.'
      },
      {
        ruleVi: 'Hướng trục ngược dòng (Shaft Upstream - Khuyến nghị cho Bột giấy & Bùn xỉ)',
        detailVi: 'Lắp trục van hướng về phía nguồn phát sinh dòng chảy (Shaft Upstream) giúp mặt sau của đĩa van bảo vệ các bề mặt làm kín và trục van khỏi sự bắn phá trực tiếp của xơ sợi bột giấy và hạt rắn mài mòn.'
      },
      {
        ruleVi: 'Hướng đệm đón áp (Seat Upstream - Khuyến nghị cho Hơi nóng & Khí sạch chênh áp cao)',
        detailVi: 'Lắp mặt đệm hướng về phía nguồn áp lực cao (Seat Upstream) cho phép áp suất đường ống hỗ trợ lực ép cơ khí, gia tăng độ kín khít tuyệt đối khi van đóng chặn áp cao (Shut-off differential pressure).'
      }
    ],
    weldingPrecautions: [
      'CẢNH BÁO NGUY HIỂM VỀ NHIỆT ĐỘ HÀN: Tuyệt đối KHÔNG ĐƯỢC HÀN mặt bích khi van đang kẹp giữa hai bích đường ống.',
      'Nhiệt độ sinh ra khi hàn hồ quang điện (>1000°C) sẽ truyền dẫn qua kim loại làm cháy xém hoặc biến tính toàn bộ đệm làm kín PTFE/Graphite, gây cong vênh trục và nứt vỡ đệm côn.',
      'QUY TRÌNH HÀN CHUẨN 4 BƯỚC: (1) Lắp van kẹp cùng gioăng tạm để lấy cữ khoảng cách chính xác giữa 2 mặt bích -> (2) Đính điểm (Tack weld) 4 vị trí trên mặt bích -> (3) Tháo rời van ra khỏi đường ống -> (4) Hàn ngấu hoàn tất mặt bích và đợi đường ống nguội hoàn toàn về nhiệt độ môi trường, vệ sinh xỉ hàn trước khi đưa van vào lắp đặt chính thức.'
    ],
    boltTorqueSequence: {
      titleVi: 'Quy trình siết bulong mặt bích theo mô hình sao chéo (Star Pattern)',
      stepsVi: [
        'Bước 1 (Lấy cữ mặt bích): Bôi trơn ren bulong và siết đều tay toàn bộ bulong (Snug-tight ~10% mô-men).',
        'Bước 2 (Giai đoạn siết 30%): Dùng cờ lê lực siết chéo đối xứng hình sao đạt 30% giá trị mô-men xoắn tiêu chuẩn.',
        'Bước 3 (Giai đoạn siết 60%): Tiếp tục siết theo thứ tự sao chéo đạt 60% mô-men xoắn danh định.',
        'Bước 4 (Giai đoạn siết 100%): Siết theo đúng thứ tự chéo đạt 100% mô-men xoắn tiêu chuẩn của bu-lông.',
        'Bước 5 (Vòng kiểm tra cuối - Final Pass): Đi một vòng tròn liên tục theo chiều kim đồng hồ ở mức 100% mô-men để đảm bảo không còn bulong nào bị nới lỏng do biến dạng nén đệm.'
      ]
    }
  },

  // 3. Operation & Commissioning (Vận hành & Chạy thử chuẩn UTDCORP)
  operationIOM: {
    actuatorStopsCalibration: 'Hiệu chuẩn cữ chặn cơ khí (Mechanical Travel Stops) trên bộ truyền động khí nén / hộp số tay quay: Đĩa van phải dừng đúng góc 90° (vuông góc hoàn toàn với dòng chảy khi đóng) hoặc 0° (song song dòng chảy khi mở). Với đệm lệch tâm ba Triple Offset, cữ chặn đóng phải dừng đúng điểm tiếp xúc nêm kín khít, tuyệt đối không được ép quá lực làm móp méo đệm kim loại.',
    rotationDirection: 'Chiều quay vận hành: Quay theo chiều kim đồng hồ để ĐÓNG (Clockwise to close), Quay ngược chiều kim đồng hồ để MỞ (Counter-clockwise to open) theo chuẩn công nghiệp quốc tế.',
    pipelineFlushing: 'QUY TẮC THỔI RỬA ĐƯỜNG ỐNG (Flushing Protocol): Khi sục rửa đường ống lần đầu để tống khứ xỉ hàn, cát xây dựng và phoi tiện, PHẢI MỞ VAN Ở VỊ TRÍ 100% (Góc mở 90°). Nếu mở hé van, các hạt kim loại và cát sẽ phi với vận tốc cao như đạn bắn cắt nát bề mặt đệm làm kín.',
    hydrotestPrecautions: 'Khi thử áp lực thủy tĩnh toàn tuyến ống (Hydrostatic test lên tới 1.5 x PN), nếu áp lực thử cao hơn áp suất thử kín ghế van (Seat test 1.1 x PN), van PHẢI ĐƯỢC GIỮ Ở TRẠNG THÁI MỞ HOÀN TOÀN.'
  },

  // 4. Maintenance & Troubleshooting Matrix (Bảo trì & Khắc phục sự cố)
  troubleshootingMatrix: [
    {
      problemVi: 'Rò rỉ qua đệm van khi van đã đóng hoàn toàn (Seat Leakage)',
      problemEn: 'Seat Leakage in Closed Position',
      causesVi: [
        'Có cặn bẩn, xỉ hàn hoặc xơ sợi kẹt vào mặt côn làm kín',
        'Cữ chặn hành trình đóng chưa đủ góc (Under-closed position)',
        'Đệm làm kín mềm PTFE bị xước hoặc đệm kim loại bị móp do va đập dị vật',
        'Lắp đặt ngược chiều áp suất thiết kế đối với ứng dụng chênh áp lớn'
      ],
      solutionsVi: [
        'Mở hé van 10° - 15° để dòng môi chất tự sục rửa và cuốn trôi cặn bẩn bám dính',
        'Hiệu chuẩn lại cữ chặn hành trình của bộ truyền động / hộp số tay quay',
        'Tháo vành giữ đệm (Seat retaining ring) để kiểm tra và thay thế bộ đệm mới',
        'Kiểm tra lại hướng mũi tên chỉ áp lực trên thân van theo đúng thiết kế hệ thống'
      ]
    },
    {
      problemVi: 'Rò rỉ qua cổ ty van ra môi trường (Stem Packing Leakage)',
      problemEn: 'Stem / Gland Packing External Leakage',
      causesVi: [
        'Đai ốc nén cổ ty bị lỏng sau thời gian dài giãn nở nhiệt',
        'Vòng đệm graphite hoặc PTFE bị mòn sau hàng trăm nghìn chu kỳ đóng mở',
        'Bề mặt trục van bị xước do bụi hạt môi trường xâm nhập'
      ],
      solutionsVi: [
        'Dùng cờ lê siết đều 2 đai ốc cổ ty van từ 1/4 đến 1/2 vòng theo chiều kim đồng hồ',
        'Nếu siết kịch ren mà vẫn rò rỉ, tiến hành thay thế bộ đệm cổ ty Live-Loaded Packing mới',
        'Kiểm tra độ nhẵn bóng bề mặt trục van (yêu cầu độ bóng bề mặt Ra <= 0.4 µm)'
      ]
    },
    {
      problemVi: 'Mô men xoắn vận hành tăng đột biến / Kẹt van (High Operating Torque / Jamming)',
      problemEn: 'High Operating Torque or Valve Jamming',
      causesVi: [
        'Đai ốc nén cổ ty bị siết quá chặt gây bó cứng trục',
        'Mặt bích đường ống siết lệch tâm gây ứng suất uốn vặn xoắn thân van',
        'Môi chất đóng rắn (như keo, nhựa đường, bột giấy khô) kẹt trong ổ đỡ',
        'Nhiệt độ môi chất tăng cao vượt ngưỡng dãn nở nhiệt cho phép'
      ],
      solutionsVi: [
        'Nới lỏng đai ốc nén cổ ty 1/4 vòng và kiểm tra lại độ trơn tru',
        'Kiểm tra độ đồng tâm và khe hở song song của hai mặt bích đường ống',
        'Bơm mỡ bôi trơn chuyên dụng chịu nhiệt vào vú mỡ ổ đỡ và hộp số',
        'Đảm bảo bộ truyền động actuator có hệ số an toàn lực mô-men xoắn tối thiểu 1.25 - 1.3'
      ]
    },
    {
      problemVi: 'Rung lắc mạnh và tiếng ồn khi điều tiết lưu lượng (Vibration, Noise & Cavitation)',
      problemEn: 'Excessive Vibration, Chatter & Hydrodynamic Noise',
      causesVi: [
        'Van vận hành liên tục ở góc mở quá nhỏ (< 15°) với chênh áp cao gây xâm thực thủy lực',
        'Van lắp quá gần đầu đẩy máy bơm hoặc co nối góc hẹp sinh dòng xoáy bất đối xứng',
        'Vận tốc dòng chảy trong đường ống vượt ngưỡng kinh tế cho phép (> 4.5 m/s với chất lỏng)'
      ],
      solutionsVi: [
        'Không duy trì van ở góc mở < 15° trong thời gian dài; chọn cỡ van thu hẹp (Reduced port) hoặc van cầu điều tiết chuyên dụng',
        'Di dời van cách xa đầu đẩy máy bơm tối thiểu 5 x DN',
        'Lắp thêm bộ khuếch tán dòng chảy hoặc tấm đục lỗ giảm âm trên đường ống'
      ]
    }
  ]
};
