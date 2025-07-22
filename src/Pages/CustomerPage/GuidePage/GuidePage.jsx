import React from "react";
import "./GuidePage.css";

function GuidePage() {
  return (
    <div className="guide-page">
      <header className="guide-page__hero" role="banner">
        <h1>Hướng dẫn kiểm tra & Bảng giá dịch vụ Xét nghiệm ADN</h1>
      </header>

      {/* Main content====================================================================== */}
      <main className="guide-page__container" role="main">
        {/* <section
          className="guide-page__banner"
          aria-label="Banner thông tin chính xác xét nghiệm ADN với kết quả sau 6 tiếng"
        >
          <h2 className="guide-page__banner-title">CHÍNH XÁC 100%</h2>
          <p className="guide-page__highlight">CÓ KẾT QUẢ SAU 6H</p>
          <small className="guide-page__note">
            Không xâm lấn - Không gây đau đớn - An toàn cho cả người lớn và trẻ
            nhỏ
          </small>
          <img
            className="guide-page__banner-img"
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/943ee253-c991-4ef1-810e-386876d92a70.png"
            alt="Gia đình đang ngồi cùng nhau cười nói vui vẻ trong phòng khách hiện đại trang nhã, biểu tượng sự tin cậy xét nghiệm ADN"
            onError={(e) => (e.target.style.display = "none")}
          />
        </section> */}

        <section
          aria-labelledby="what-is-adn-title"
          className="guide-page__explanation"
        >
          <h2 id="what-is-adn-title" className="guide-page__section-title">
            Xét nghiệm ADN cha con là gì?
          </h2>
          <p>
            Xét nghiệm ADN cha con là phương pháp phân tích ADN lấy từ mẫu sinh
            học như: tế bào niêm mạc miệng, máu, tóc... Để xác định mối quan hệ
            huyết thống cha con hoặc các quan hệ gia đình khác thông qua sự
            tương đồng ADN.
          </p>
          <p>
            Phương pháp này được áp dụng rộng rãi trong y học, pháp lý và xác
            minh huyết thống chính xác tuyệt đối.
          </p>
          <img
            className="guide-page__section-img"
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/54d79a15-f6c9-4372-b534-5da64639b1e4.png"
            alt="Phòng thí nghiệm xét nghiệm ADN hiện đại, có chuyên gia mặc áo trắng làm việc nghiêm túc với thiết bị phân tích DNA"
          />
        </section>

        {/* Bảng giá======================================================================================================================= */}
        <section className="content-section" aria-labelledby="price-list">
          <h2 id="price-list" className="guide-page__section-title">Bảng giá xét nghiệm ADN</h2>
          <table
            className="price-list"
            summary="Bảng giá các loại xét nghiệm ADN được cung cấp cùng mô tả và chi phí"
          >
            <thead>
              <tr>
                <th scope="col">Tên xét nghiệm</th>
                <th scope="col">Mô tả</th>
                <th scope="col">Giá (VND)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Xét nghiệm di truyền cơ bản</td>
                <td>Kiểm tra các bệnh di truyền và đặc điểm phổ biến.</td>
                <td>1.500.000 VND</td>
              </tr>
              <tr>
                <td>Gói sức khỏe toàn diện</td>
                <td>
                  Phân tích chi tiết các nguy cơ sức khỏe liên quan đến di
                  truyền.
                </td>
                <td>3.500.000 VND</td>
              </tr>
              <tr>
                <td>Báo cáo nguồn gốc tổ tiên</td>
                <td>Truy xuất nguồn gốc tổ tiên và thành phần dân tộc.</td>
                <td>1.800.000 VND</td>
              </tr>
              <tr>
                <td>Xét nghiệm dược di truyền</td>
                <td>
                  Đánh giá phản ứng di truyền với thuốc để cá nhân hóa điều trị.
                </td>
                <td>2.500.000 VND</td>
              </tr>
              <tr>
                <td>Bộ kiểm tra nguy cơ ung thư chuyên biệt</td>
                <td>
                  Đánh giá nguy cơ ung thư di truyền và các chỉ dấu liên quan.
                </td>
                <td>4.000.000 VND</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ======================================================================================================================================================================== */}
        {/* Quy trình xét nghiệm ADN ================================================================================================================= */}

        <section aria-labelledby="how-is-adn-done-title">
          <h2 id="how-is-adn-done-title" className="guide-page__section-title">
            Quy trình xét nghiệm ADN cha con như thế nào?
          </h2>
          <p>
            Quy trình xét nghiệm ADN bao gồm lấy mẫu, chuẩn bị mẫu, phân tích và
            trả kết quả. Mẫu sinh học thường lấy qua dịch niêm mạc miệng bằng
            que tăm bông không đau, sau đó mẫu được gửi đến phòng xét nghiệm để
            phân tích.
          </p>
          <div className="guide-page__features-list" role="list">
            {[
              {
                label: "Tế bào niêm mạc miệng",
                img: "0bc10d3b-505a-46d0-8e30-6d2f0117e7a6",
                alt: "Biểu tượng que tăm bông lấy tế bào niêm mạc miệng",
              },
              {
                label: "Mẫu tủy, máu",
                img: "3b2bb5f6-5503-4def-8246-9a0a8ea684ee",
                alt: "Biểu tượng ống nghiệm chứa mẫu máu đỏ",
              },
              {
                label: "Mẫu tóc chân",
                img: "5464cbb3-9b4b-414e-98c3-bc79c57bc842",
                alt: "Biểu tượng một nhúm tóc người",
              },
              {
                label: "Móng tay, chân",
                img: "396619fd-0de9-43b1-8bd5-3e890ab7cac0",
                alt: "Biểu tượng móng tay được cắt nhỏ",
              },
              {
                label: "Nước miếng",
                img: "c726b05a-eeef-4402-8292-1ca7f46c6996",
                alt: "Biểu tượng giọt nước miếng",
              },
              {
                label: "Không lấy thuốc lá, bụi bẩn",
                img: "8fccf3d3-5d54-4ebd-8bd6-3df64318c11f",
                alt: "Biểu tượng cảnh báo không lấy mẫu từ thuốc lá và bụi bẩn",
              },
            ].map(({ label, img, alt }, idx) => (
              <article
                key={idx}
                className="guide-page__feature-item"
                role="listitem"
                tabIndex={0}
                aria-label={label}
              >
                <img
                  className="guide-page__feature-icon"
                  src={`https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/${img}.png`}
                  alt={alt}
                  onError={(e) => (e.target.style.display = "none")}
                />
                {label}
              </article>
            ))}
          </div>
        </section>

        <section
          className="guide-page__consultation"
          aria-labelledby="consultation-title"
        >
          <div className="guide-page__consultation-left">
            <h2 id="consultation-title" className="guide-page__section-title">
              Đăng ký tư vấn xét nghiệm ADN huyết thống
            </h2>
            <p>Chính xác, nhanh chóng, uy tín hàng đầu Việt Nam</p>
            <small>
              Liên hệ ngay để được hỗ trợ tư vấn miễn phí và báo giá chi tiết
            </small>
            <button
              className="guide-page__btn"
              type="button"
              aria-label="Bấm để mở form đăng ký tư vấn"
            >
              Đăng ký tư vấn
            </button>
          </div>

          <div
            className="guide-page__consultation-right"
            role="form"
            aria-label="Form đăng ký tư vấn xét nghiệm ADN"
          >
            <form id="consultForm" noValidate>
              <label htmlFor="name">Họ và tên</label>
              <input
                className="guide-page__input"
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Nhập họ tên của bạn"
                required
                aria-required="true"
              />

              <label htmlFor="phone">Số điện thoại</label>
              <input
                className="guide-page__input"
                type="tel"
                id="phone"
                name="phone"
                placeholder="Nhập số điện thoại"
                autoComplete="tel"
                pattern="[\d\s\+\-]{9,15}"
                title="Số điện thoại hợp lệ gồm số và dấu +, -"
                required
                aria-required="true"
              />

              <label htmlFor="service">Dịch vụ quan tâm</label>
              <select
                className="guide-page__select"
                id="service"
                name="service"
                required
                aria-required="true"
              >
                <option value="" disabled selected>
                  Chọn dịch vụ
                </option>
                <option value="xet-nghiem-cha-con">
                  Xét nghiệm ADN cha con
                </option>
                <option value="xet-nghiem-anh-em">Xét nghiệm ADN anh em</option>
                <option value="xet-nghiem-me-con">Xét nghiệm ADN mẹ con</option>
                <option value="xet-nghiem-gia-dinh">
                  Xét nghiệm ADN tổng thể gia đình
                </option>
              </select>

              <input
                className="guide-page__submit"
                type="submit"
                value="Gửi đăng ký"
                aria-label="Gửi đăng ký tư vấn xét nghiệm ADN"
              />
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default GuidePage;
