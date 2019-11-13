<template>
  <section class="documents" id="documents">
    <container>
      <h2>Documents</h2>
      <div class="documents__btns">
        <btn class="document__btn document__btn--nda" href="#">NDA</btn>
        <btn class="document__btn document__btn--public" href="#">PUBLIC OFFER AGREEMENT</btn>
      </div>
      <div class="documents__desc">
        <p>
          Six Nines takes care
          about your privacy and
          guarantee do not use
          source files and
          rendering results at any purpose.
        </p>
        <p>
          We just provide rendering
          — you are making
          something beautiful.
        </p>
      </div>
    </container>
  </section>
</template>

<script>
export default {
  name: 'Documents',

}
</script>

<style lang="scss" scoped>
.documents {
  padding-top: 44px;
  padding-bottom: 72px;
  background: $blue-color;

  h2 {
    text-align: center;
  }

  // @include bp(tablet) {
    // margin-bottom: 65px;

    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  // }

  @include bp(desktop) {
    padding-top: 80px;
    padding-bottom: 88px;
  }
}

.documents__btns {
  margin-bottom: 48px;
  display: flex;
}

.document__btn {
  @include btn($gray-dark-color, $blue-color, $violet-color, 150px, 58px);
  width: 100%;
  margin-left: 20px;

  &--public {
    max-width: 290px;
    padding-left: 42px;
    padding-right: 42px;
  }
}


.documents__desc {
  font-size: 24px;

  p + p {
    margin-top: 35px;
  }

  // @include bp(tablet) {
    font-size: 23px;
    font-weight: 300;

    p + p {
      margin-top: 0;
    }
  // }
}
</style>
