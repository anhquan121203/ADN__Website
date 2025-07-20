import React from "react";
import "./AboutPage.css";

function AboutPage() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const callSupport = () => {
        window.location.href = "tel:+84000000000";
    };

    return (
        <div className="aboutUs-page">
            <header className="aboutUs-page__hero" role="banner">
                <h1>TẦM NHÌN VÀ SỨ MỆNH</h1>
            </header>

            <nav className="aboutUs-page__btn-group" aria-label="Primary actions">
                <button className="aboutUs-page__btn aboutUs-page__btn--blue" type="button" aria-label="Button to register for consultation">
                    Đăng ký tư vấn
                </button>
                <button className="aboutUs-page__btn aboutUs-page__btn--orange" type="button" aria-label="Button to schedule an appointment">
                    Đặt lịch hẹn
                </button>
                <button className="aboutUs-page__btn aboutUs-page__btn--green" type="button" aria-label="Button for patient guide">
                    Trợ giúp bệnh nhân
                </button>
            </nav>

            <nav aria-label="Breadcrumb" className="aboutUs-page__breadcrumb">
                <a href="#">Trang chủ</a>
                <span aria-hidden="true">›</span>
                <a href="#">Về Vinmec</a>
                <span aria-hidden="true">›</span>
                <span aria-current="page">Tầm nhìn và sứ mệnh</span>
            </nav>


            {/* =================================================================================================== */}
            {/* Giới thiệu chung */}
            <main className="aboutUs-page__container" role="main">
                <section className="aboutUs-page__intro-section" aria-labelledby="intro-title">
                    <article className="aboutUs-page__intro-text">
                        <h2 id="intro-title">Giới thiệu chung</h2>
                        <p>
                            Vinmec ý chính mục tiêu mang đến một môi trường y tế - chăm sóc sức khỏe chất lượng cao và đồng bộ, góp phần nâng cao sức khỏe cộng đồng, nâng tầm dịch vụ y tế.
                        </p>
                        <div className="aboutUs-page__vision-mission" aria-label="Vision and mission statements">
                            <strong>Tầm nhìn</strong>
                            <span>
                                Vinmec cam kết phát triển hệ thống y tế hiện đại với đội ngũ y bác sĩ hàng đầu, đem lại dịch vụ y tế chất lượng cao cho cộng đồng thông qua công nghệ tiên tiến và trải nghiệm khác biệt.
                            </span>
                            <strong>Sứ mệnh</strong>
                            <span>
                                Chăm sóc sức khỏe toàn diện, tận tâm và hiệu quả với sự chuyên nghiệp và tận tụy.
                            </span>
                        </div>
                    </article>
                    <figure className="aboutUs-page__intro-image">
                        <img
                            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d9599cee-4a78-485b-9b6b-79d0cbef292e.png"
                            alt="Group of medical professionals"
                            onError={(e) => (e.target.style.display = "none")}
                        />
                    </figure>
                </section>

                {/* ================================================================================================================= */}
                {/* Giá trị cốt lõi */}
                <section className="aboutUs-page__values-section" aria-labelledby="values-title">
                    <div className="aboutUs-page__values-container">
                        <div className="aboutUs-page__values-left">
                            <h3 id="values-title">
                                Giá trị cốt lõi - <span>C.A.R.E</span>
                            </h3>
                            <div className="aboutUs-page__values-grid">
                                <div className="aboutUs-page__value-card">
                                    <div className="aboutUs-page__value-icon">💡</div>
                                    <div>
                                        <strong>CREATIVITY – SÁNG TẠO</strong>
                                        <p>Không ngừng sáng tạo và đổi mới nhằm mang lại các giải pháp tốt nhất cho người bệnh.</p>
                                    </div>
                                </div>
                                <div className="aboutUs-page__value-card">
                                    <div className="aboutUs-page__value-icon">👥</div>
                                    <div>
                                        <strong>ACCOUNTABILITY – TRÁCH NHIỆM</strong>
                                        <p>Chịu trách nhiệm cao nhất với bệnh nhân và người nhà về y đức, kỹ năng, tri thức và chuyên môn.</p>
                                    </div>
                                </div>
                                <div className="aboutUs-page__value-card">
                                    <div className="aboutUs-page__value-icon">🤝</div>
                                    <div>
                                        <strong>RELIABILITY – TIN CẬY</strong>
                                        <p>Cam kết mang lại độ tin cậy cao nhất với dịch vụ y tế chất lượng và an toàn.</p>
                                    </div>
                                </div>
                                <div className="aboutUs-page__value-card">
                                    <div className="aboutUs-page__value-icon">🏆</div>
                                    <div>
                                        <strong>EXCELLENCE – HOÀN HẢO</strong>
                                        <p>Hướng tới chất lượng dịch vụ cao nhất và quy trình khám chữa bệnh tốt nhất.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <figure className="aboutUs-page__values-image">
                            <img
                                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/43f0f3b9-d7a2-42aa-bab0-cdbe1a9fcb07.png"
                                alt="Heart shape symbolizing care"
                                onError={(e) => (e.target.style.display = "none")}
                            />
                        </figure>
                    </div>
                </section>

            </main>

            <aside className="aboutUs-page__system-capacity" aria-labelledby="system-capacity-title" role="complementary">
                <div className="aboutUs-page__container">
                    <h3 id="system-capacity-title">Năng lực Hệ thống</h3>
                    <div className="aboutUs-page__capacity-grid" role="list">
                        {[
                            ["85%", "Mức độ hài lòng của khách hàng"],
                            ["1,505", "Bệnh viện"],
                            ["6 triệu", "Khách hàng khám phục vụ"],
                            ["4 triệu", "Lượt khám ngoại trú"],
                            ["626 triệu", "Quỹ bảo hiểm Y tế, trợ cấp"],
                            ["11", "Bệnh viện và Phòng khám"],
                            ["3.782", "Nhân sự y tế"],
                            ["597", "Bác sĩ"],
                            ["1.626", "Chỉ số chất lượng"],
                            ["135", "Được cấp"],
                        ].map(([value, label], index) => (
                            <div className="aboutUs-page__capacity-item" role="listitem" key={index}>
                                <strong>{value}</strong>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            <div className="aboutUs-page__floating-btns" aria-label="Quick actions">
                <button
                    className="aboutUs-page__floating-btn"
                    aria-label="Scroll to top"
                    type="button"
                    title="Scroll to top"
                    onClick={scrollToTop}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                        <polyline points="18 15 12 9 6 15" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button
                    className="aboutUs-page__floating-btn"
                    aria-label="Contact support by call"
                    type="button"
                    title="Contact support phone"
                    onClick={callSupport}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                        <path
                            d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.52 19.52 0 01-6-6A19.86 19.86 0 012 4.11V1.11A2 2 0 014.11 0h3a2 2 0 012 1.72c.13 1.21.38 2.4.74 3.53a2 2 0 01-.45 2.11L9.1 10.79a16 16 0 006 6l1.43-1.43a2 2 0 012.11-.45c1.13.36 2.32.61 3.53.74A2 2 0 0122 16.92z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default AboutPage;
