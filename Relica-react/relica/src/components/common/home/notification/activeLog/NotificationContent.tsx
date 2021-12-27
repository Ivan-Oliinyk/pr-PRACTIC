import React from "react";
import { ActiveLogItem } from "./ActiveLogItem";
import { Props } from "./ActiveLogItem";

interface Items {
  items: Props[];
}

export const NotificationContent: React.FC<Items> = ({ items }) => {
  return (
    <div className="notification__content">
      <div className="notification__active-logs">
        {items.map(({ image, alt, user, reaction, timeAgo, targetImg }, i) => (
          <ActiveLogItem
            key={i}
            image={image}
            alt={alt}
            user={user}
            reaction={reaction}
            timeAgo={timeAgo}
            targetImg={targetImg}
          />
        ))}
      </div>
    </div>
  );
};
