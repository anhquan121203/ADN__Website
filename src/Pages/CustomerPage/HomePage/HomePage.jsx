import React from "react";
import "./HomePage.css";

function HomePage() {
  const whyItems = [
    {
      iconPath: "M12 0a9 9 0 100 18 9 9 0 000-18zm1 14l-6-4.5L13 7v7z",
      title: "Chuyên gia hàng đầu",
      desc: "Vinmec quy tụ đội ngũ chuyên gia, bác sĩ giỏi với hơn 78 bác sĩ được đào tạo chuyên sâu nước ngoài...",
    },
    {
      iconPath: "M12 4a8 8 0 018 8 8 8 0 11-16 0 8 8 0 018-8z",
      title: "Chất lượng quốc tế",
      desc: "Hệ thống y tế Vinmec quản lý nghiêm ngặt và đạt chuẩn quốc tế...",
    },
    {
      iconPath:
        "M13 11h-2V7h2zm0 4h-2v-2h2z M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z",
      title: "Công nghệ tiên tiến",
      desc: "Vinmec trang bị cơ sở vật chất hiện đại với các thiết bị y tế tiên tiến nhất...",
    },
    {
      iconPath:
        "M14 2H6a2 2 0 00-2 2v16h12a2 2 0 002-2V6a2 2 0 00-2-2z M10 12h4v2h-4zm0-4h8v2h-8z",
      title: "Nghiên cứu & Đổi mới",
      desc: "Vinmec tiên phong đầu tư phát triển nghiên cứu và ứng dụng khoa học y học hiện đại...",
    },
  ];

  const certImageIds = [
    "c13ccc1d-68d5-4487-99ed-20462f69de7f",
    "e2b910f3-9e7f-442d-bc9b-93fad2e5d392",
    "01a4adcc-fa74-40ae-9593-5a8480f93752",
  ];

  const thumbIds = [
    "e5503369-102a-49d5-bef7-cfd39d4d9540",
    "529bc4f7-86a0-4254-8afb-6283c799ae1d",
    "f5d5da4e-43b3-46dc-8083-e388423cfda7",
  ];

  return (
    <div className="homepage">
      <header className="homepage__header">
        <div className="homepage__container">
          <div className="homepage__hero">
            <div
              className="homepage__hero-text"
              aria-label="Chăm sóc bằng tài năng, y đức và sự thấu cảm"
            >
              <h1>
                Chăm sóc bằng tài năng, <br /> y đức và sự thấu cảm
              </h1>
              <a
                href="#"
                className="homepage__btn-primary"
                aria-label="Xem thêm"
              >
                Xem thêm
              </a>
            </div>

            {/* <div className="homepage__hero-cta" aria-label="Registration call to action">
              <small>TÔI VINMEC</small>
              Đi sinh an nhàn <br />
              Mẹ đã sẵn sàng
              <div className="homepage__register-line">ĐĂNG KÝ NGAY! 024 3985 8789</div>
            </div> */}

            <div
              className="homepage__hero-image"
              aria-label="Ảnh người phụ nữ mang thai đang cười"
            >
              <img
                src="https://genolife.com.vn/wp-content/uploads/2025/01/review-trung-tam-xet-nghiem-ADN-01-1024x683.jpg"
                alt="Smiling pregnant woman"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          </div>

          {/* infor box================================================================ */}
          <section className="homepage__info-boxes">
            <article className="homepage__info-box">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 1.5.75 4.5 2.5 7 1.41 1.98 2.86 3 4.5 3s3.09-1.02 4.5-3c1.75-2.5 2.5-5.5 2.5-7 0-3.87-3.13-7-7-7z" />
              </svg>
              <strong>Gọi tổng đài</strong>
              Tư vấn và hỗ trợ 24/7 cho các vấn đề của bạn
            </article>
            <article className="homepage__info-box">
              <svg viewBox="0 0 24 24">
                <path d="M19 3h-3V1h-8v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14z" />
              </svg>
              <strong>Đặt lịch hẹn</strong>
              Đặt lịch hẹn nhanh chóng, tiện lợi và chính xác
            </article>
            <article className="homepage__info-box">
              <svg viewBox="0 0 24 24">
                <path d="M11 7h2v6h-2zm0 8h2v2h-2z" />
              </svg>
              <strong>Tư vấn bảo hiểm</strong>
              Tư vấn bảo hiểm dễ dàng cùng chuyên gia và Vinmec uy tín
            </article>
          </section>
        </div>
      </header>

      {/* Section 2: Tại sao nen chọn Blooding ==================================================================================*/}
      <main className="homepage__main">
        <section className="homepage__why">
          <h2>Tại sao nên chọn Blooding?</h2>
          <div className="homepage__why-content">
            <div className="homepage__why-img">
              <img
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/73b2231e-108a-4c14-83ac-05fec02b94be.png"
                alt="Female doctor"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
            <div className="homepage__why-texts">
              {whyItems.map((item, index) => (
                <article key={index} className="homepage__why-text">
                  <div className="homepage__why-icon">
                    <svg viewBox="0 0 24 24">
                      <path d={item.iconPath} />
                    </svg>
                  </div>
                  <div className="homepage__why-content-text">
                    <strong>{item.title}</strong>
                    {item.desc}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

{/* ================================================================================================ */}
        <section className="homepage__certifications">
          <div className="homepage__container">
            <div className="homepage__cert-info">
              Chứng nhận và giải thưởng <br />
              Blooding tự hào được các tổ chức y tế hàng đầu thế giới công nhận
            </div>
            <div className="homepage__cert-logos">
              {certImageIds.map((id) => (
                <img
                  key={id}
                  src={`https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/${id}.png`}
                  alt="Certification logo"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="homepage__clinic">
          <h2>Hệ thống phòng khám và trung tâm của chúng tôi</h2>
          <p>Blooding là hệ thống y tế tiên tiến nhất tại Việt Nam...</p>
          <div className="homepage__clinic-gallery">
            <div className="homepage__clinic-main">
              <img
                src="https://hiephoibenhvientu.com.vn/wp-content/uploads/2019/05/aih-about-mobile1539329268.jpg"
                alt="Vinmec building"
              />
            </div>
            <div className="homepage__clinic-thumbs">
              {thumbIds.map((id) => (
                <div key={id} className="homepage__clinic-thumb">
                  <img
                    src={`https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/${id}.png`}
                    alt="Clinic thumbnail"
                  />
                </div>
              ))}
            </div>
          </div>
          <a href="#" className="homepage__btn-secondary">
            Xem thêm
          </a>
        </section>
      </main>

      <div className="homepage__side-buttons">
        <button
          className="homepage__circle-btn"
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
          </svg>
        </button>
        <a
          href="tel:02439858789"
          className="homepage__circle-btn"
          aria-label="Call hotline"
        >
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.2.5 2.5.78 3.84.78a1 1 0 011 1v3.5a1 1 0 01-1 1C8.48 21.5 2.5 15.52 2.5 8a1 1 0 011-1h3.5a1 1 0 011 1c0 1.34.29 2.64.78 3.84a1 1 0 01-.21 1.11l-2.2 2.2z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default HomePage;
