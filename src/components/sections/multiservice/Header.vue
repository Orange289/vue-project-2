<template>
  <div class="m-header">
    <multiContainer>
      <div class="m-header__controls">
        <a href="tel:+46768479177" class="m-header__phone">
          <svg><use xlink:href="#sprite-phone"></use></svg>
        </a>
        <logo isMultiservice />
        <Burger />
      </div>
      <Menu class="m-header__menu"/>
    </multiContainer>
  </div>
</template>

<script>
import multiContainer from  './Container';
import Burger from  './Burger';
import Menu from  './Menu';

export default {
  name: 'MultiHeader',
  components: {
    multiContainer,
    Burger,
    Menu
  }
}
</script>

<style lang="scss">
.m-header {

  @include bp(tablet) {
    padding-top: 65px;
  }
}

.m-header__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 44px;
  padding-bottom: 44px;

  @include bp(tablet) {
    display: none;
  }
}

.m-header__phone {
  svg {
    width: 50px;
    height: 54px;
  }
}
</style>
