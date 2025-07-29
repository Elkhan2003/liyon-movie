<script setup lang="ts">
import { Modal } from 'ant-design-vue';

const searchStore = useSearchStore();

const props = defineProps<{
	isOpen: boolean;
	handleCancel: () => void;
}>();

const handleOk = (e: MouseEvent) => {
	console.log(e);
	props.handleCancel();
};
</script>

<template>
	<section class="SearchModal">
		<Modal
			:open="props.isOpen"
			title="SearchModal"
			@ok="handleOk"
			@cancel="props.handleCancel"
		>
			<p>Some contents...</p>
			<p>Some contents...</p>
			<p>Some contents...</p>
		</Modal>
	</section>
</template>

<style lang="scss" scoped></style>
