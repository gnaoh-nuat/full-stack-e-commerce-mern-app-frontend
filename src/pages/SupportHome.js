import React from "react";
import { Link } from "react-router-dom";
import {
  FaQuestionCircle,
  FaEnvelope,
  FaShippingFast,
  FaUndo,
  FaShieldAlt,
} from "react-icons/fa"; // Cần cài: npm install react-icons

// Data cho các mục hỗ trợ
const supportTopics = [
  {
    title: "Liên hệ",
    description: "Gửi câu hỏi hoặc liên lạc trực tiếp với chúng tôi.",
    path: "/support/contact",
    icon: <FaEnvelope className="w-8 h-8 text-red-500" />,
  },
  {
    title: "Câu hỏi thường gặp (FAQs)",
    description: "Tìm câu trả lời cho các câu hỏi phổ biến nhất.",
    path: "/support/faq",
    icon: <FaQuestionCircle className="w-8 h-8 text-red-500" />,
  },
  {
    title: "Chính sách vận chuyển",
    description: "Thông tin về phí và thời gian giao hàng.",
    path: "/support/shipping-policy",
    icon: <FaShippingFast className="w-8 h-8 text-red-500" />,
  },
  {
    title: "Chính sách đổi trả",
    description: "Quy trình đổi, trả hàng và hoàn tiền.",
    path: "/support/return-policy",
    icon: <FaUndo className="w-8 h-8 text-red-500" />,
  },
  {
    title: "Chính sách bảo mật",
    description: "Cách chúng tôi bảo vệ thông tin của bạn.",
    path: "/support/privacy-policy",
    icon: <FaShieldAlt className="w-8 h-8 text-red-500" />,
  },
];

const SupportHome = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-slate-800 mb-4 text-center">
        Trung tâm hỗ trợ
      </h1>
      <p className="text-lg text-slate-600 mb-8 text-center">
        Chúng tôi có thể giúp gì cho bạn?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {supportTopics.map((topic) => (
          <Link
            key={topic.path}
            to={topic.path}
            className="flex items-center gap-4 p-5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:shadow-sm transition-all group"
          >
            <div className="flex-shrink-0">{topic.icon}</div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 group-hover:text-red-600 transition-colors">
                {topic.title}
              </h2>
              <p className="text-sm text-slate-500 mt-1">{topic.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SupportHome;
