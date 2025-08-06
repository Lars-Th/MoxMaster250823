<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Ändra lösenord</DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Ändra lösenord för:
          <strong>{{ user?.namn }}</strong>
        </p>

        <div class="space-y-2">
          <Label for="newPassword">Nytt lösenord</Label>
          <div class="relative">
            <Input
              id="newPassword"
              :model-value="passwordForm.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="Minst 8 tecken"
              @update:model-value="value => updatePasswordForm('newPassword', value as string)"
            />
            <Button
              variant="ghost"
              size="sm"
              class="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              @click="showNewPassword = !showNewPassword"
            >
              <Eye v-if="!showNewPassword" class="h-4 w-4" />
              <EyeOff v-else class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="confirmNewPassword">Bekräfta nytt lösenord</Label>
          <div class="relative">
            <Input
              id="confirmNewPassword"
              :model-value="passwordForm.confirmPassword"
              :type="showConfirmNewPassword ? 'text' : 'password'"
              placeholder="Upprepa lösenordet"
              @update:model-value="value => updatePasswordForm('confirmPassword', value as string)"
            />
            <Button
              variant="ghost"
              size="sm"
              class="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              @click="showConfirmNewPassword = !showConfirmNewPassword"
            >
              <Eye v-if="!showConfirmNewPassword" class="h-4 w-4" />
              <EyeOff v-else class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div class="flex gap-4 justify-end pt-4">
          <Button variant="outline" @click="emit('update:open', false)">Avbryt</Button>
          <Button
            :disabled="!passwordForm.newPassword || !passwordForm.confirmPassword"
            @click="handleSave"
          >
            Spara lösenord
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, EyeOff } from 'lucide-vue-next';

// Types
interface User {
  id: string;
  namn: string;
  epost: string;
}

interface PasswordForm {
  newPassword: string;
  confirmPassword: string;
}

// Props
interface Props {
  open: boolean;
  user: User | null;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  'update:open': [open: boolean];
  save: [userId: string, newPassword: string];
}>();

// Local state
const showNewPassword = ref(false);
const showConfirmNewPassword = ref(false);
const passwordForm = ref<PasswordForm>({
  newPassword: '',
  confirmPassword: '',
});

// Watch for dialog open/close to reset form
watch(
  () => props.open,
  isOpen => {
    if (!isOpen) {
      resetForm();
    }
  }
);

// Methods
const updatePasswordForm = (field: keyof PasswordForm, value: string) => {
  passwordForm.value[field] = value;
};

const resetForm = () => {
  passwordForm.value = {
    newPassword: '',
    confirmPassword: '',
  };
  showNewPassword.value = false;
  showConfirmNewPassword.value = false;
};

const handleSave = () => {
  if (!props.user || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    return;
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    // TODO: Show error message
    return;
  }

  emit('save', props.user.id, passwordForm.value.newPassword);
  emit('update:open', false);
};
</script>
