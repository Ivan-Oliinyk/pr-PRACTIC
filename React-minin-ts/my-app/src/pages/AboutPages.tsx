import React from "react";
import { useNavigate } from "react-router-dom";

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1>Страница информации</h1>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos provident
        beatae distinctio tenetur labore nulla, nihil qui consectetur maxime,
        laboriosam nostrum omnis cum earum quasi corrupti magni, suscipit
        impedit dolorem? Temporibus cupiditate expedita vel repellat officia
        animi nesciunt saepe, cum impedit iusto necessitatibus nisi non ducimus
        quam id aliquid illum maiores perspiciatis exercitationem, facere
        excepturi qui. Amet minima quaerat unde! Quis atque, quod repellat
        perferendis voluptatibus sunt corrupti porro id, exercitationem et,
        deleniti possimus odit ad eaque voluptatum quia in unde. Mollitia omnis
        consectetur suscipit dolorum animi quisquam a saepe? Placeat fugit alias
        nulla porro, tempore sunt maiores magnam. Doloremque, neque? Enim
        dolores ex vero reprehenderit accusamus placeat tempore quaerat. Ea,
        possimus iure. Sunt aliquid amet beatae, ducimus iure quidem. Corrupti
        dicta maiores totam cupiditate accusamus iure sunt ea, laboriosam
        numquam at atque facilis harum libero blanditiis animi nesciunt
        perferendis ab commodi saepe autem ex et a fugit! Iusto, consequuntur.
        Nam provident eum aspernatur beatae labore eligendi vero, iure cum
        minima at, dignissimos expedita libero culpa adipisci similique odit
        molestias maxime voluptates sapiente ad a? Quam labore accusantium ut
        iste! Asperiores natus repellendus tempora magnam odit. Adipisci placeat
        tenetur id sequi eum culpa, eligendi necessitatibus hic similique amet
        repellat molestias voluptates dolorum autem qui harum vitae totam. Ea,
        sit voluptates. Neque explicabo dolorem qui maxime eaque doloremque
        doloribus tempore. Velit adipisci vitae neque, ipsam quo ipsum eaque
        earum rem fuga, esse ex laborum recusandae eius tempore obcaecati!
        Consequuntur, corrupti nihil. Deserunt, consequuntur atque. Odio maiores
        quasi, iusto nisi eum maxime vitae laudantium numquam laborum officiis
        nulla sunt dolor cum voluptate dolorum illo delectus blanditiis saepe?
        Accusantium magni qui neque ratione. Pariatur voluptatibus dicta, ex
        exercitationem facilis quasi inventore nesciunt debitis ea assumenda
        distinctio est sequi, minus iusto, eius maxime facere quibusdam sunt
        provident accusantium architecto consequatur esse velit deleniti. Harum.
      </p>
      <button
        className="btn"
        onClick={() => {
          navigate("/", { replace: true });
        }}
      >
        Обратно к списку дел
      </button>
    </>
  );
};
