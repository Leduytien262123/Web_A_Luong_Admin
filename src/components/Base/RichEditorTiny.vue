<script setup>
import Editor from "@tinymce/tinymce-vue";
import "tinymce/tinymce";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/plugins/wordcount";
import "tinymce/models/dom";
import "tinymce/skins/ui/oxide/skin";
import "tinymce/skins/ui/oxide/content";
import "tinymce/skins/content/default/content";
import "tinymce/skins/content/default/content.min.css";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  inline: {
    type: Boolean,
    default: false,
  },
  height: {
    type: Number,
    default: 250,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const item = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const editorSettings = ref({
  selector: "textarea#custom-toolbar-group-button#context-menu",
  toolbar_mode: "floating",
  statusbar: true,
  menubar: true,
  promotion: false,
  branding: false,
  height: props.height || "300px",
  width: "100%",
  skin: false,
  content_style: `body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;line-height:1.4;margin:1rem}table{border-collapse:collapse}table:not([cellpadding]) td,table:not([cellpadding]) th{padding:.4rem}table[border]:not([border="0"]):not([style*=border-width]) td,table[border]:not([border="0"]):not([style*=border-width]) th{border-width:1px}table[border]:not([border="0"]):not([style*=border-style]) td,table[border]:not([border="0"]):not([style*=border-style]) th{border-style:solid}table[border]:not([border="0"]):not([style*=border-color]) td,table[border]:not([border="0"]):not([style*=border-color]) th{border-color:#ccc}figure{display:table;margin:1rem auto}figure figcaption{color:#999;display:block;margin-top:.25rem;text-align:center}hr{border-color:#ccc;border-style:solid;border-width:1px 0 0 0}code{background-color:#e8e8e8;border-radius:3px;padding:.1rem .2rem}.mce-content-body:not([dir=rtl]) blockquote{border-left:2px solid #ccc;margin-left:1.5rem;padding-left:1rem}.mce-content-body[dir=rtl] blockquote{border-right:2px solid #ccc;margin-right:1.5rem;padding-right:1rem}`,
});
</script>
<template>
  <Editor
    v-model="item"
    :disabled="props.disabled"
    plugins="wordcount"
    :inline="props.inline"
    toolbar="undo redo | fontfamily fontsize | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent"
    :init="editorSettings"
  />
</template>
