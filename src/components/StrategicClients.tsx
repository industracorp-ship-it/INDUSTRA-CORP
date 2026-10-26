import React from 'react';
import { Building2, Award, Quote, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { SupportedLanguage } from '../types/valve';

interface StrategicClientsProps {
  lang: SupportedLanguage;
}

export const StrategicClients: React.FC<StrategicClientsProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  const clients = [
    { 
      name: lang === 'vi' 
        ? 'TẬP ĐOÀN DẦU KHÍ VIỆT NAM (PETROVIETNAM)' 
        : (lang === 'zh' ? '越南国家石油天然气集团 (PETROVIETNAM)' : 'VIETNAM NATIONAL OIL AND GAS (PETROVIETNAM)'), 
      role: 'Petrochemical Plants', 
      project: lang === 'vi' 
        ? 'Nhà máy Lọc Hóa Dầu' 
        : (lang === 'zh' ? '炼油与石化工程' : 'Refinery & Petrochemical Plants') 
    },
    { 
      name: lang === 'vi' 
        ? 'TẬP ĐOÀN ĐIỆN LỰC VIỆT NAM (EVN)' 
        : (lang === 'zh' ? '越南国家电力集团 (EVN)' : 'VIETNAM ELECTRICITY (EVN)'), 
      role: 'Power Generation', 
      project: lang === 'vi' 
        ? 'Nhiệt Điện Vĩnh Tân & Duyên Hải' 
        : (lang === 'zh' ? '永新与沿海大型火电工程' : 'Vinh Tan & Duyen Hai Thermal Power') 
    },
    { 
      name: lang === 'vi' 
        ? 'TẬP ĐOÀN HÒA PHÁT' 
        : (lang === 'zh' ? '和发钢铁工业集团 (HOA PHAT)' : 'HOA PHAT GROUP'), 
      role: 'Heavy Industry & Steel', 
      project: lang === 'vi' 
        ? 'Khu Liên Hợp Gang Thép Dung Quất' 
        : (lang === 'zh' ? '榕桔钢铁冶金一体化基地' : 'Dung Quat Integrated Steel Complex') 
    },
    { 
      name: 'VINAMILK CORP', 
      role: 'F&B Dairy Manufacturing', 
      project: lang === 'vi' 
        ? 'Nhà máy Sữa Mega Bình Dương' 
        : (lang === 'zh' ? '平阳超级乳品制造基地' : 'Mega Dairy Manufacturing Complex') 
    },
    { 
      name: lang === 'vi' 
        ? 'TỔNG CÔNG TY SABECO' 
        : (lang === 'zh' ? '西贡啤酒饮料总公司 (SABECO)' : 'SABECO BEVERAGE CORP'), 
      role: 'Brewing & Beverage', 
      project: lang === 'vi' 
        ? 'Nhà máy Bia Sài Gòn Củ Chi' 
        : (lang === 'zh' ? '古芝啤酒酿造工厂' : 'Cu Chi Brewery Plant') 
    },
    { 
      name: lang === 'vi' 
        ? 'TỔNG CÔNG TY KHÍ VIỆT NAM (PV GAS)' 
        : (lang === 'zh' ? '越南国家天然气公司 (PV GAS)' : 'PV GAS CORPORATION'), 
      role: 'Natural Gas Transmission', 
      project: lang === 'vi' 
        ? 'Kho Cảng LNG Thị Vải' 
        : (lang === 'zh' ? '氏威 LNG 接收站码头' : 'Thi Vai LNG Terminal') 
    },
  ];

  const testimonials = [
    {
      quote: lang === 'vi' 
        ? 'Dòng van bi Inox 316 và van cầu hơi UTD lắp đặt cho dự án mở rộng lò hơi hoạt động liên tục 3 năm chưa từng phát sinh sự cố rò rỉ. CO/CQ và chứng chỉ kiểm định xuất xưởng rất chuẩn chỉ.'
        : lang === 'zh'
        ? '在锅炉扩建项目中使用的 UTD 316 不锈钢球阀与波纹管截止阀已连续运行3年，无任何泄漏隐患。材质化验单 (Mill Test 3.1) 与出厂合格证书极其规范齐全。'
        : 'The UTD SS316 ball and globe valves have performed non-stop for 3 years without a single leak. The test certs and Mill Test reports are exemplary.',
      author: lang === 'vi' 
        ? 'Kỹ sư Nguyễn Hoàng Nam' 
        : (lang === 'zh' ? '阮黄男 总工程师' : 'Eng. Hoang Nam Nguyen'),
      title: lang === 'vi' 
        ? 'Giám Đốc Ban Quản Lý Dự Án Cơ Điện (EPC Contractor)' 
        : (lang === 'zh' ? '机电工程总承包项目总监' : 'M&E Project Management Director (EPC Contractor)'),
      org: lang === 'vi' 
        ? 'Dự án Cụm Công nghiệp Phía Nam' 
        : (lang === 'zh' ? '南部重点工业园建设项目部' : 'Southern Industrial Cluster Project')
    },
    {
      quote: lang === 'vi'
        ? 'Chúng tôi đánh giá rất cao năng lực giao hàng 24h từ kho dự án của UTD. Khi công trình cần gấp hơn 180 bộ van bướm DN200 - DN400, UTD đáp ứng ngay trong ngày, cứu tiến độ bàn giao.'
        : lang === 'zh'
        ? '我们高度认可 UTD 仓储物流中心24小时极速发货能力。当现场抢工急需 180 套 DN200 - DN400 蝶阀时，UTD 当天出库送达现场，挽救了关键调试节点。'
        : 'UTD delivered 180 sets of DN200-DN400 butterfly valves directly from stock within 24 hours, keeping our critical commissioning schedule on track.',
      author: lang === 'vi' 
        ? 'Trần Minh Đức' 
        : (lang === 'zh' ? '陈明德 工程师' : 'Minh Duc Tran'),
      title: lang === 'vi' 
        ? 'Chỉ Huy Trưởng Hệ Thống Cấp Nước & PCCC' 
        : (lang === 'zh' ? '给排水与消防管网现场总指挥' : 'Chief Site Engineer (Water & Fire Protection)'),
      org: lang === 'vi' 
        ? 'Tổng Thầu Xây Lắp M&E' 
        : (lang === 'zh' ? '机电安装工程总承包集团' : 'M&E General Contracting Corp')
    }
  ];

  return (
    <section id="clients" className="py-16 sm:py-20 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 font-mono">
            {lang === 'vi' ? 'TÍN NHIỆM BỞI CÁC TẬP ĐOÀN HÀNG ĐẦU' : (lang === 'zh' ? '全球工业巨头与国家工程高度信赖' : 'PROVEN TRACK RECORD')}
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.clientsTitle}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            {t.clientsSubtitle}
          </p>
        </div>

        {/* Strategic Clients Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
          {clients.map((client, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between items-center text-center transition-all hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 group-hover:border-amber-500/50 transition-colors">
                <Building2 className="w-5 h-5 text-blue-400 group-hover:text-amber-400 transition-colors" />
              </div>
              <h4 className="text-xs font-bold text-slate-200 uppercase line-clamp-2 leading-tight">
                {client.name}
              </h4>
              <span className="text-[10px] text-amber-400/90 font-mono mt-2 block border-t border-slate-800/80 pt-2 w-full truncate">
                {client.project}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((tItem, i) => (
            <div
              key={i}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between"
            >
              <Quote className="w-10 h-10 text-slate-800 absolute top-4 right-4" />
              <p className="text-xs sm:text-sm text-slate-300 italic relative z-10 leading-relaxed mb-6">
                "{tItem.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <div className="w-9 h-9 rounded-full bg-blue-900/60 border border-blue-600/50 flex items-center justify-center font-bold text-white text-xs font-mono">
                  {tItem.author.charAt(tItem.author.lastIndexOf(' ') + 1) || 'U'}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {tItem.author}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </h5>
                  <p className="text-[11px] text-slate-400">{tItem.title} - {tItem.org}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
