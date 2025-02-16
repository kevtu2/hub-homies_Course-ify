<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="p-6 max-w-lg mx-auto bg-white shadow-lg border border-gray-200">
      <h1 class="fancy-text">My Title</h1>
      <p class="mt-4 text-gray-800">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for this example
</script>

<style scoped>
.fancy-text {
  font-size: 3rem; /* Large size for visibility */
  font-weight: bold; /* Bold text */
  color: #228b22; /* Green text color (center) */

  /* Multiple shadows to create a gold outline around the green text */
  text-shadow:
    -2px 0 #e0c261,
    2px 0 #e0c261,
    0 2px #e0c261,
    0 -2px #e0c261,
    2px 2px #e0c261,
    -2px -2px #e0c261,
    2px -2px #e0c261,
    -2px 2px #e0c261;
}
</style>
