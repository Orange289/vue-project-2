<template>
  <main class="multiservice">
    <topHeader />
    <div class="multiservice__content">
      <multiHeader />
      <multiContainer>
        <breadcrumbs :items="breadcrumbs" />
        <h1>Multiservice Rent</h1>
      </multiContainer>
    </div>
    <multiForm />
    <multiContainer class="multiservice__description">
      <p>GPFS — value that represent both computing powers and and the time for which you rent these powers. Six Nines uses GFPS for billing. Imagine, you want to take 200 nodes for Deep Learning for 7 hours. We charge for it 15,4 GFPS or €15 400. If you an CG & VFX artist and want to book 10 nodes for a 2 weeks, our price is about €16 800, because 10 nodes for 2 weeks are equal 16,8 GFPS.</p>
      <p>Just fill our Multiservice rent form and our system will automatically calculate the total cost of renting.</p>
      <p>In one hand, 1 GPFS always equal €1000. In another hand, 1 GPFS consist of some amount one of the three types nodes that you can rent and of some time. For example, 1 GPFS in rendering means that you can take 200 nodes for 1 hour or 20 nodes for 10 hours.</p>
    </multiContainer>
    <multiFooter />
  </main>
</template>

<script>
import multiContainer from './../sections/multiservice/Container';
import multiHeader from './../sections/multiservice/Header';
import multiForm from './../sections/multiservice/Form';
import multiFooter from './../sections/multiservice/Footer';

document.body.classList.add('body-multiservice');

export default {
  components: {
    multiContainer,
    multiHeader,
    multiForm,
    multiFooter
  },
  data() {
    return {
      breadcrumbs: [
        {
          id: 'home',
          name: 'home',
          url: 'https://sixnines.se/',
        },
        {
          id: 'multiservice',
          name: 'Multiservice Rent',
          url: '',
          isActive: true
        }
      ],
      action: '#'
    }
  }
}
</script>

<style lang="scss">
.multiservice {
  color: #fff;

  .breadcrumbs {
    margin-top: 0;

    a {
      cursor: pointer;

      &.active {
        cursor: default;
      }

      &:hover {
        text-decoration: underline;
      }

      &.active:hover {
        text-decoration: none;
      }
    }

    @include bp(0 tablet) {
      a {
        font-size: 30px;
      }
    }

    @include bp(tablet) {
      margin-top: 60px;
    }
  }

  .top-header {
    background-color: #473f7a;


    .container {
      max-width: 1056px;
      padding-left: 30px;
      padding-right: 30px;
      justify-content: flex-end;

      [href="/signin/"] {
        display: none;
      }
    }

    .top-header__user {
      display: none;
    }

    @include bp(0 tablet) {
      display: none;
    }
  }

  .top-header__contact+.top-header__contact {
    margin-left: 10px;
  }

  h1 {
    font-size: 52px;
    font-style: italic;
    margin-top: 65px;
  }

  @include bp(tablet) {
    h1 {
      font-size: 78px;
      margin-top: 85px;
    }
  }
}

.multiservice__content {
  background: url('https://sixnines.se/wp-content/uploads/2019/03/gall_full.jpg');
  position: relative;
  padding-bottom: 70px;

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    background: rgba($violet-color, .6);
    width: 100%;
    height: 100%;
  }

  @include bp(tablet) {
    padding-bottom: 120px;
  }
}

.multiservice .multiservice__description {
  font-size: 18px;
  color: #000;
  padding-top: 80px;
  padding-bottom: 80px;

  p {
    margin: 20px 0;
  }

  @include bp(tablet) {
    padding-top: 80px;
    padding-bottom: 80px;
  }
}
</style>
