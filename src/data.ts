// Static imports for team frames
import oncFrame from "@/public/frames/01-onc.png";
import vuttFrame from "@/public/frames/02-vutt.png";
import team201Frame from "@/public/frames/03-201.png";
import dongthapFrame from "@/public/frames/04-dongthap.png";
import vinhlongFrame from "@/public/frames/05-vinhlong.png";
import songxanhFrame from "@/public/frames/06-songxanh.png";
import usvolunteerFrame from "@/public/frames/07-usvolunteer.png";
import muahequocteFrame from "@/public/frames/08-muahequocte.png";
import vnxkFrame from "@/public/frames/09-vnxk.png";
import bhdFrame from "@/public/frames/10-bhd.png";
import bttFrame from "@/public/frames/11-btt.png";
import banChiHuyFrame from "@/public/frames/_BanChiHuy.png";
import { StaticImageData } from "next/image";

export interface Team {
  id: string;
  name: string;
  color: string;
  frameUrl: StaticImageData | string;
  description?: string;
}

export const teams: Team[] = [
  {
    id: "onc",
    name: "ONC",
    color: "#EF4444",
    frameUrl: oncFrame,
    description: "Đội hình ONC",
  },
  {
    id: "vutt",
    name: "VUTT",
    color: "#3B82F6",
    frameUrl: vuttFrame,
    description: "Đội hình VUTT",
  },
  {
    id: "team-201",
    name: "Đội hình 201",
    color: "#10B981",
    frameUrl: team201Frame,
    description: "Đội hình 201",
  },
  {
    id: "dongthap",
    name: "Đồng Tháp",
    color: "#F59E0B",
    frameUrl: dongthapFrame,
    description: "Đội hình Đồng Tháp",
  },
  {
    id: "vinhlong",
    name: "Vĩnh Long",
    color: "#8B5CF6",
    frameUrl: vinhlongFrame,
    description: "Đội hình Vĩnh Long",
  },
  {
    id: "songxanh",
    name: "Sống Xanh",
    color: "#06B6D4",
    frameUrl: songxanhFrame,
    description: "Đội hình Sống Xanh",
  },
  {
    id: "usvolunteer",
    name: "US Volunteer",
    color: "#84CC16",
    frameUrl: usvolunteerFrame,
    description: "Đội hình US Volunteer",
  },
  {
    id: "muahequocte",
    name: "Mùa Hè Quốc Tế",
    color: "#F97316",
    frameUrl: muahequocteFrame,
    description: "Đội hình Mùa Hè Quốc Tế",
  },
  {
    id: "vnxk",
    name: "VNXK",
    color: "#EC4899",
    frameUrl: vnxkFrame,
    description: "Đội hình Văn nghệ Xung kích",
  },
  {
    id: "bhd",
    name: "BHD",
    color: "#6366F1",
    frameUrl: bhdFrame,
    description: "Ban Hoạt động",
  },
  {
    id: "btt",
    name: "BTT",
    color: "#14B8A6",
    frameUrl: bttFrame,
    description: "Ban Truyền thông",
  },
  {
    id: "ban-chi-huy",
    name: "Ban Chỉ Huy",
    color: "#DC2626",
    frameUrl: banChiHuyFrame,
    description: "Ban Chỉ Huy",
  },
];

// Campaign configuration
export const campaignConfig = {
  title: "Twibbonize",
  subtitle:
    "Chiến dịch Mùa hè Xanh 2025 trường Đại học Khoa học tự nhiên TP.HCM",
  year: "2025",
  footerText: "Chiến dịch Mùa hè Xanh 2025",

  // Step titles (can be customized for different languages)
  stepTitles: {
    team: "Chọn Đội",
    upload: "Tải Ảnh",
    crop: "Cắt & Xem trước",
    final: "Tải xuống",
  },

  // Button texts
  buttonTexts: {
    startOver: "Bắt đầu lại",
    downloadProfilePicture: "Tải xuống Ảnh đại diện",
    shareCampaign: "Chia sẻ Chiến dịch",
    generating: "Đang tạo...",
  },

  // Instruction texts
  instructions: {
    chooseTeam: "Chọn Đội hình của bạn",
    uploadImage: "Tải lên Ảnh đại diện của bạn",
    cropImage: "Cắt Ảnh của bạn",
    finalReady: "Ảnh đại diện của bạn đã sẵn sàng!",

    // Upload instructions
    dropImage: "Thả ảnh của bạn vào đây",
    orClickToBrowse: "hoặc nhấp để duyệt",
    imageSelected: "Ảnh đã được chọn!",
    clickOrDragToChange: "Nhấp hoặc kéo để thay đổi",
    supportedFormats: "Hỗ trợ JPG, PNG, GIF tối đa 10MB",

    // Crop instructions
    cropInstructions: {
      title: "Cách cắt ảnh của bạn:",
      dragCorners: "Kéo các góc để thay đổi kích thước vùng cắt",
      dragCenter: "Kéo trung tâm để di chuyển vùng cắt",
      autoApply: "Việc cắt sẽ được áp dụng tự động để tạo ảnh cuối cùng",
    },

    // Final preview instructions
    finalTips: {
      title: "Mẹo để có kết quả tốt nhất:",
      useAsProfile: "Sử dụng làm ảnh đại diện trên mạng xã hội",
      shareSupport: "Chia sẻ để thể hiện sự ủng hộ của bạn cho chiến dịch",
      tagFriends: "Gắn thẻ bạn bè để tham gia đội của bạn!",
    },
  },

  // Social sharing configuration
  socialSharing: {
    title: "Chiến dịch Mùa hè Xanh 2025",
    description: "Xem ảnh đại diện của tôi cho chiến dịch Mùa hè Xanh 2025!",
  },
};
