<script setup lang="ts">
import { onErrorCaptured, provide, ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

interface Props {
  fallbackComponent?: string;
  showDetails?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  fallbackComponent: 'default',
  showDetails: false,
});

const router = useRouter();
const hasError = ref(false);
const errorInfo = ref<{
  message: string;
  stack?: string;
  timestamp: Date;
}>();

// Capture errors from child components
onErrorCaptured(error => {
  console.error('Error captured by ErrorBoundary:', error);

  hasError.value = true;
  errorInfo.value = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date(),
  };

  // Prevent the error from propagating further
  return false;
});

// Provide error reporting function to child components
const reportError = (error: Error, context?: string) => {
  console.error('Error reported to ErrorBoundary:', error, context);

  hasError.value = true;
  errorInfo.value = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date(),
  };
};

provide('reportError', reportError);

const retry = () => {
  hasError.value = false;
  errorInfo.value = undefined;
};

const goHome = () => {
  hasError.value = false;
  errorInfo.value = undefined;
  router.push('/');
};

const reloadPage = () => {
  window.location.reload();
};
</script>

<template>
  <div>
    <!-- Error State -->
    <div v-if="hasError" class="min-h-screen flex items-center justify-center p-4">
      <Card class="w-full max-w-md">
        <CardHeader class="text-center">
          <div
            class="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4"
          >
            <AlertTriangle class="w-6 h-6 text-destructive" />
          </div>
          <CardTitle class="text-xl">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground text-center">
            We're sorry, but something unexpected happened. Please try again.
          </p>

          <!-- Error Details (Development) -->
          <div v-if="props.showDetails && errorInfo" class="space-y-2">
            <details class="text-xs">
              <summary class="cursor-pointer font-medium">Error Details</summary>
              <div class="mt-2 p-2 bg-muted rounded text-xs font-mono">
                <p>
                  <strong>Message:</strong>
                  {{ errorInfo.message }}
                </p>
                <p>
                  <strong>Time:</strong>
                  {{ errorInfo.timestamp.toLocaleString() }}
                </p>
                <pre v-if="errorInfo.stack" class="mt-2 whitespace-pre-wrap">{{
                  errorInfo.stack
                }}</pre>
              </div>
            </details>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-2">
            <Button class="w-full" @click="retry">
              <RefreshCw class="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" class="w-full" @click="goHome">
              <Home class="w-4 h-4 mr-2" />
              Go Home
            </Button>
            <Button variant="ghost" class="w-full text-xs" @click="reloadPage">Reload Page</Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Normal Content -->
    <slot v-else />
  </div>
</template>
