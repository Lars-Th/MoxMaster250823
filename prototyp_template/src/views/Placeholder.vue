<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Placeholder</h1>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <p class="text-gray-600 mb-4">
          This is the main placeholder page. Use the navigation menu to access specific placeholder
          sections.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 class="font-semibold text-lg mb-2">Placeholder 1</h3>
            <p class="text-gray-600 mb-3">Access the first placeholder section.</p>
            <router-link
              to="/placeholder/1"
              class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Go to Placeholder 1
            </router-link>
          </div>

          <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 class="font-semibold text-lg mb-2">Placeholder 2</h3>
            <p class="text-gray-600 mb-3">Access the second placeholder section.</p>
            <router-link
              to="/placeholder/2"
              class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Go to Placeholder 2
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
