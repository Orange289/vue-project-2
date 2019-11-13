<template>
  <footer class="m-footer">
    <multiContainer>
      <logo class="logo--mobile" isMultiservice/>
      <div class="m-footer__top">
        <logo isMultiservice />
        <ul class="m-footer__links">
          <li v-for="(item, index) in items" :key="index" :class="[{'m-footer__btn' : item.isBtn}]">
            <a :href="item.url">{{ item.name }}</a>
          </li>
          <li class="m-footer__facebook">
            <a href="https://www.facebook.com/Six-Nines-800782973599301/?epa=SEARCH_BOX">
              <svg>
                <use xlink:href="#sprite-social-facebook"></use>
              </svg>
              FACEBOOK
            </a>
          </li>
        </ul>
      </div>
      <div class="m-footer__bottom">
        <div class="m-footer__text">
          <p>Six nines AB, reg number 559140-9254, c/o Hellström Advokatbyrå, Box 7305, 103 90 STOCKHOLM</p>
        </div>
        <a class="m-footer__social" href="#">
          <svg>
            <use xlink:href="#sprite-social-facebook"></use>
          </svg>
          FACEBOOK
        </a>
      </div>
    </multiContainer>
    <div class="m-footer__lowest">
      <multiContainer>
        <p>
          CMNO Ltd Reg. Number HE 376006<br> Ioannis Stylianou, 6, Floor 2, Flat 202 2003, Nicosia, Cyprus
        </p>
      </multiContainer>
    </div>
  </footer>
</template>

<script>
import multiContainer from './Container';

export default {
  name: 'Footer',
  components: {
    multiContainer
  },
  data() {
    return {
      items: [
        {
          name: 'Home',
          url: 'https://sixnines.se/',
        },
        {
          name: 'DEEP LEARNING',
          url: 'https://sixnines.se/deeplearning/'
        },
        {
          name: 'MULTISERVICE RENT',
          url: 'https://render.sixnines.se/multiservice-rent/'
        },
        {
          name: 'CONTACTS',
          url: 'https://sixnines.se/#contacts'
        },
        {
          name: 'Make a request',
          url: 'https://sixnines.se/deeplearning/#makearequestblock',
          isBtn: true
        },
      ]
    }
  }
}
</script>

<style lang="scss">
.m-footer {
  background: $gray-dark-color;
  padding-top: 60px;
  padding-bottom: 62px;

  a {
    text-decoration: none;

    &:hover {
      color: $blue-color;
    }
  }

  .m-footer__btn {
    @include multi-btn();
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 40px;
    order: 1;
    width: 160px;

    a{
      margin-left: 0;

      &:hover {
        text-decoration: none;
      }
    }

    @include bp(0 tablet) {
      order: -1;
      width: 350px;
      margin-left: 0;
      margin-bottom: 66px;
    }

    @include bp(0 420px) {
      width: 100%;
    }
  }

  @include bp(0 tablet) {
    padding-top: 80px;

    .logo {
      display: none;
    }

    .m-container {
      display: flex;
      flex-wrap: wrap;
    }
  }

  @include bp(desktop) {
    padding-top: 97px;
    padding-bottom: 80px;
  }
}

.logo.logo--mobile {
  display: block;
  width: 100%;
  text-align: center;
  order: 0;

  svg {
    width: 225px;
    height: 70px;
  }

  @include bp(tablet) {
    display: none;
  }
}

.m-footer .m-footer__facebook {
  margin-top: 42px;

  a {
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg {
    width: 50px;
    height: 50px;
    margin-right: 20px;
  }

  @include bp(tablet) {
    display: none;
  }
}

.m-footer__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;

  @include bp(0 tablet) {
    flex-wrap: wrap;
    order: 2;
  }
}

.m-footer__links {
  display: flex;
  align-items: center;

  a {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    text-transform: uppercase;
  }

  li + li a {
    margin-left: 40px;
  }

  @include bp(0 tablet) {
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 20px;

    li {
      width: 100%;
      text-align: center;
      margin-bottom: 42px;

      a {
        font-size: 30px;
        font-weight: 400;
      }
    }

    li + li a {
      margin-left: 0;
    }
  }
}

.m-footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;

  @include bp(0 tablet) {
    order: 1;
  }
}

.m-footer__text {
  max-width: 345px;

  p {
    font-size: 12px;
    color: rgba(#fff, .2);
  }

  @include bp(0 tablet) {
    max-width: 100%;

    p {
      font-size: 28px;
      font-weight: 300;
      margin-top: 56px;
      text-align: center;
    }
  }
}

.m-footer__social {
  display: flex;
  color: #fff;
  font-weight: 600;

  svg {
    width: 20px;
    height: 20px;
    margin-right: 14px;
  }

  @include bp(0 tablet) {
    display: none;
  }
}

.m-footer__lowest {
  margin-top: 30px;
  border-top: 1px solid rgba(255,255,255,.25);

  .m-container {
    display: flex;
    justify-content: flex-end;
  }

  p {
    font-size: 12px;
    color: rgba(#fff, .2);
    padding: 30px 0;
    text-align: right;
  }

  @include bp(0 tablet) {
    margin-top: 0;
    padding-top: 84px;
    padding-bottom: 64px;

    p {
      font-size: 28px;
      font-weight: 300;
      padding: 70px 0;
      text-align: center;
    }
  }
}
</style>
