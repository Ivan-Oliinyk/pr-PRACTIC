import React from "react";

export const Income: React.FC = () => {
  return (
    <div className="notification__content">
      <div className="contain-middle income">
        <h1 className="title">Total earned</h1>
        <ul className="statistic-list">
          <li className="statistic-item">
            <div className="statistic-item__img">
              <img
                src="/images/svg/st3.svg"
                alt="image"
                width="58"
                height="58"
              />
            </div>
            <div className="statistic-item__context">
              <h2 className="stat-title">Total earned (USD)</h2>
              <span className="price">$5.00</span>
            </div>
          </li>
          <li className="statistic-item">
            <div className="statistic-item__img">
              <img
                src="/images/svg/st2.svg"
                alt="image"
                width="58"
                height="58"
              />
            </div>
            <div className="statistic-item__context">
              <h2 className="stat-title">Total earned (USD)</h2>
              <span className="price color-green">$5.00</span>
            </div>
          </li>
          <li className="statistic-item">
            <div className="statistic-item__img">
              <img
                src="/images/svg/st1.svg"
                alt="image"
                width="58"
                height="58"
              />
            </div>
            <div className="statistic-item__context">
              <h2 className="stat-title">Total earned (USD)</h2>
              <span className="price color-brown">243</span>
            </div>
          </li>
        </ul>

        <table className="stat-table">
          <thead className="head">
            <tr>
              <th>
                <img
                  src="/images/svg/comment1.svg"
                  alt=""
                  width="14"
                  height="14"
                />
                <span className="title-1">Post</span>
              </th>
              <th>
                <img
                  src="/images/svg/comment1.svg"
                  alt=""
                  width="14"
                  height="14"
                />
                <span>Likes</span>
              </th>
              <th>
                <img
                  src="/images/svg/comment1.svg"
                  alt=""
                  width="14"
                  height="14"
                />
                <span>Comments</span>
              </th>
              <th>
                <img
                  src="/images/svg/comment1.svg"
                  alt=""
                  width="14"
                  height="14"
                />
                <span>Favourites</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img
                  src="/images/chat/img1.png"
                  alt="photo"
                  width="80"
                  height="80"
                />
              </td>
              <td>
                <span className="text1">32</span>
                <span className="text2">+ $0.05</span>
              </td>
              <td>
                <span className="text1">12</span>
                <span className="text2">+ $0.05</span>
              </td>
              <td>
                <span className="text1">4</span>
                <span className="text2">+ $0.05</span>
              </td>
            </tr>
            <tr>
              <td>
                <img
                  src="/images/chat/img6.png"
                  alt="photo"
                  width="80"
                  height="80"
                />
              </td>
              <td>
                <span className="text1">32</span>
                <span className="text2">+ $0.05</span>
              </td>
              <td>
                <span className="text1">12</span>
                <span className="text2">+ $0.05</span>
              </td>
              <td>
                <span className="text1">4</span>
                <span className="text2">+ $0.05</span>
              </td>
            </tr>
            <tr>
              <td>
                <img
                  src="/images/chat/img4.png"
                  alt="photo"
                  width="80"
                  height="80"
                />
              </td>
              <td>
                <span className="text1">32</span>
                <span className="text2">+ $0.05</span>
              </td>
              <td>
                <span className="text1">12</span>
                <span className="text2">+ $0.05</span>
              </td>
              <td>
                <span className="text1">4</span>
                <span className="text2">+ $0.05</span>
              </td>
            </tr>
            <tr>
              <td>
                <img
                  src="/images/chat/img5.png"
                  alt="photo"
                  width="80"
                  height="80"
                />
              </td>
              <td>
                <span className="text1">32</span>
                <span className="text2">+ $0.05</span>
              </td>
              <td>
                <span className="text1">12</span>
                <span className="text2">+ $0.05</span>
              </td>
              <td>
                <span className="text1">4</span>
                <span className="text2">+ $0.05</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    // </section>
  );
};
