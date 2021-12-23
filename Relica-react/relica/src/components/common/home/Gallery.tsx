import React from "react";

export const Gallery: React.FC = () => {
  return (
    <section className="chat-3 chat-4">
      <h1 className="chat-4__title">Explore</h1>
      <nav className="chat-4__nav">
        <ul className="nav__list">
          <li className="nav__item">Most recent</li>
          <li className="nav__item">Most liked</li>
          <li className="nav__item">Discovered</li>
        </ul>
      </nav>

      <div className="chat-3__gallary-wrapper">
        <ul className="chat-3__gallary">
          <li className="img-wrapper">
            <img src="/images/chat/img1.png" alt="image1" />
            <div className="icon-wrapper">
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-heart"></use>
                </svg>
                120
              </div>
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-comment"></use>
                </svg>
                34
              </div>
            </div>
          </li>
          <li className="img-wrapper">
            <img src="/images/chat/img2.png" alt="image2" />
            <div className="icon-wrapper">
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-heart"></use>
                </svg>
                17
              </div>
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-comment"></use>
                </svg>
                17
              </div>
            </div>
          </li>
          <li className="img-wrapper">
            <img src="/images/chat/img3.png" alt="image3" />
            <div className="icon-wrapper">
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-heart"></use>
                </svg>
                210
              </div>
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-comment"></use>
                </svg>
                32
              </div>
            </div>
          </li>
          <li className="img-wrapper">
            <img src="/images/chat/img4.png" alt="image4" />
            <div className="icon-wrapper">
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-heart"></use>
                </svg>
                181
              </div>
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-comment"></use>
                </svg>
                57
              </div>
            </div>
          </li>
          <li className="img-wrapper">
            <img src="/images/chat/img5.png" alt="image5" />
            <div className="icon-wrapper">
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-heart"></use>
                </svg>
                91
              </div>
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-comment"></use>
                </svg>
                41
              </div>
            </div>
          </li>
          <li className="img-wrapper">
            <img src="/images/chat/img6.png" alt="image6" />
            <div className="icon-wrapper">
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-heart"></use>
                </svg>
                191
              </div>
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-comment"></use>
                </svg>
                189
              </div>
            </div>
          </li>
          <li className="img-wrapper">
            <img src="/images/chat/img7.png" alt="image7" />
            <div className="icon-wrapper">
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-heart"></use>
                </svg>
                89
              </div>
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-comment"></use>
                </svg>
                66
              </div>
            </div>
          </li>
          <li className="img-wrapper">
            <img src="/images/chat/img8.png" alt="image8" />
            <div className="icon-wrapper">
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-heart"></use>
                </svg>
                220
              </div>
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-comment"></use>
                </svg>
                34
              </div>
            </div>
          </li>
          <li className="img-wrapper">
            <img src="/images/chat/img9.png" alt="image9" />
            <div className="icon-wrapper">
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-heart"></use>
                </svg>
                156
              </div>
              <div className="icon-context">
                <svg className="icon" width="40" height="40">
                  <use href="/images/symbol-defs.svg#icon-comment"></use>
                </svg>
                312
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};
