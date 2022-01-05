import React from "react";
import styled from "styled-components";
import Typography from "../../components/typography/Typography";
import { FontSize } from "../../components/typography/Typography";
import { baseTheme } from "../../styles/theme";
import InputText from "../../components/form/InputText";
import UserPostComments from "./post/UserPostComments";

const PostsWrapper = styled.div``;

const UserPostWrapper = styled.section`
  margin-bottom: 3.5rem;
  padding-top: 5.6rem;
`;

const PostContainer = styled.div`
  max-width: 77rem;
  margin-left: auto;
  margin-right: auto;
`;

const UserPost = styled.div`
  display: flex;
  align-items: center;
`;

const UserPostImg = styled.img`
  margin-right: 1.5rem;
  border-radius: 50%;
`;

const UserPostTextWrapper = styled.div``;

const UserPostImgWrapper = styled.div`
  width: 77rem;
  height: 77rem;

  img {
    width: 100%;
    margin-top: 3rem;
    object-fit: cover;
    object-position: center;
    border-radius: 1rem;
  }
`;

const WrapperLikesComments = styled.div`
  margin-top: 2.7rem;
  display: flex;

  .user-post__likes-box {
    display: flex;

    .img {
      border-radius: 1.5rem;
    }

    &:not(:last-of-type) {
      margin-right: 3.7rem;
    }
  }
`;

const LikesContent = styled.div`
  display: flex;
  align-items: center;

  img {
    border-radius: 1.5rem;
  }

  &:not(:last-of-type) {
    margin-right: 3.7rem;
  }
`;

const Counter = styled.div`
  margin-left: 0.7rem;
`;

const Posts = () => {
  return (
    <PostsWrapper>
      <UserPostWrapper>
        <PostContainer>
          <UserPost>
            <UserPostImg
              src="./images/user-post/user1.png"
              width="56"
              height="56"
              alt="user"
            />
            <UserPostTextWrapper>
              <Typography fontSize={FontSize.ms} weight={700}>
                Jessica Thorne
              </Typography>
              <Typography weight={500} color={baseTheme.colors.greyPrimary}>
                3 minute ago
              </Typography>
            </UserPostTextWrapper>
          </UserPost>
          <Typography margin="3.1rem 0 0 0">
            Japanese food with my friends Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua ali
          </Typography>

          <UserPostImgWrapper>
            <img src="/images/user-post/img-user1.png" alt="post" />
          </UserPostImgWrapper>
          <WrapperLikesComments>
            <LikesContent>
              <img
                className="img"
                src="./images/user-post/favorite.svg"
                alt="favorite"
                width="22"
                height="20"
              />
              <Counter>
                <Typography as="p" fontSize={FontSize.mm} weight={500}>
                  124
                </Typography>
              </Counter>
            </LikesContent>
            <LikesContent>
              <img
                className="img"
                src="./images/user-post/comment.svg"
                alt="favorite"
                width="22"
                height="20"
              />
              <Counter>
                <Typography as="p" fontSize={FontSize.mm} weight={500}>
                  123
                </Typography>
              </Counter>
            </LikesContent>
          </WrapperLikesComments>

          <UserPostComments />
          <InputText value="Add comments" name="comments" />
        </PostContainer>
      </UserPostWrapper>

      <UserPostWrapper>
        <PostContainer>
          <UserPost>
            <UserPostImg
              src="/images/user-post/user2.png"
              width="56"
              height="56"
              alt="user"
            />
            <UserPostTextWrapper>
              <Typography fontSize={FontSize.ms} weight={700}>
                Max Richardson
              </Typography>
              <Typography weight={500} color={baseTheme.colors.greyPrimary}>
                10 minute ago
              </Typography>
            </UserPostTextWrapper>
          </UserPost>
          <Typography margin="3.1rem 0 0 0">
            Holiday with my friends at #place
          </Typography>

          <UserPostImgWrapper>
            <img src="/images/user-post/user2-post.png" alt="post" />
          </UserPostImgWrapper>
          <WrapperLikesComments>
            <LikesContent>
              <img
                className="img"
                src="./images/user-post/favorite.svg"
                alt="favorite"
                width="22"
                height="20"
              />
              <Counter>
                <Typography as="p" fontSize={FontSize.mm} weight={500}>
                  124
                </Typography>
              </Counter>
            </LikesContent>
            <LikesContent>
              <img
                className="img"
                src="./images/user-post/comment.svg"
                alt="favorite"
                width="22"
                height="20"
              />
              <Counter>
                <Typography as="p" fontSize={FontSize.mm} weight={500}>
                  123
                </Typography>
              </Counter>
            </LikesContent>
          </WrapperLikesComments>

          <InputText value="Add comments" name="comments" />
        </PostContainer>
      </UserPostWrapper>
    </PostsWrapper>
  );
};

export default Posts;
