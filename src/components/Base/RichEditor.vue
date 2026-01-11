<script setup>
import Editor from "@tinymce/tinymce-vue";
import "tinymce/tinymce";
import "tinymce/models/dom";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/skins/ui/oxide/skin.css";
import "tinymce/plugins/image";
import "tinymce/plugins/media";
import "tinymce/plugins/lists";
import "tinymce/plugins/advlist";
import "tinymce/plugins/link";
import "tinymce/plugins/autolink";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/table";
import "tinymce/plugins/importcss";
import "tinymce/plugins/save";

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
    type: [Number, String],
    default: 200,
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
const onPickerCallback = async (cb, value, meta) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  if (meta && meta.filetype === "image") {
    input.setAttribute("accept", "image/*");
  }

  input.onchange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const resp = await api.uploadToS3(file.name, file, {
        contentEncoding: "blob",
        contentType: file.type,
      });

      const url =
        resp?.data?.fileUrl ||
        resp?.data?.direct_url ||
        resp?.data?.directUrl ||
        resp?.fileUrl ||
        resp?.direct_url;
      if (!url) throw new Error("Upload failed: no url returned from S3 API");

      cb(url, { title: file.name });
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  input.click();
};

const onImageUploadHandler = (blobInfo, progress) =>
  new Promise((resolve, reject) => {
    const file = blobInfo.blob();
    api
      .uploadToS3(
        file.name,
        file,
        { contentEncoding: "blob", contentType: file.type },
        (p) => {
          try {
            progress && progress(p);
          } catch (e) {}
        }
      )
      .then((resp) => {
        const url =
          resp?.data?.fileUrl ||
          resp?.data?.direct_url ||
          resp?.data?.directUrl ||
          resp?.fileUrl ||
          resp?.direct_url;
        if (!url) return reject("Upload failed: no url returned from S3 API");
        resolve(url);
      })
      .catch((error) => {
        reject(error);
      });
  });

const contentStyle = `body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;line-height:1.4;margin:1rem}table{border-collapse:collapse}table:not([cellpadding]) td,table:not([cellpadding]) th{padding:.4rem}table[border]:not([border="0"]):not([style*=border-width]) td,table[border]:not([border="0"]):not([style*=border-width]) th{border-width:1px}table[border]:not([border="0"]):not([style*=border-style]) td,table[border]:not([border="0"]):not([style*=border-style]) th{border-style:solid}table[border]:not([border="0"]):not([style*=border-color]) td,table[border]:not([border="0"]):not([style*=border-color]) th{border-color:#ccc}figure{display:table;margin:1rem auto}figure figcaption{color:#999;display:block;margin-top:.25rem;text-align:center}hr{border-color:#ccc;border-style:solid;border-width:1px 0 0 0}code{background-color:#e8e8e8;border-radius:3px;padding:.1rem .2rem}.mce-content-body:not([dir=rtl]) blockquote{border-left:2px solid #ccc;margin-left:1.5rem;padding-left:1rem}.mce-content-body[dir=rtl] blockquote{border-right:2px solid #ccc;margin-right:1.5rem;padding-right:1rem} audio,video,img{display:inline;padding:2px}`;
</script>
<template>
  <editor
    v-model="item"
    :disabled="props.disabled"
    :init="{
      inline: props.inline,
      selector: 'textarea#custom-toolbar-group-button#context-menu',
      height: props.height || 500,
      width: '100%',
      statusbar: true,
      branding: false,
      skin: false,
      content_css: false,
      content_style: contentStyle,
      plugins:
        'advlist anchor autolink link lists image media preview save table fullscreen code',
      menubar: true,
      promotion: false,
      toolbar_mode: 'wrap',
      toolbar: [
        'undo redo | fontfamily fontsize | styles | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link media image table | removeformat code fullscreen | help',
      ],
      contextmenu: 'link image table',
      file_picker_types: 'file image media',
      a11y_advanced_options: true,
      file_picker_callback: onPickerCallback,
      images_upload_handler: onImageUploadHandler,
      image_advtab: true,
      image_title: true,
      image_description: true,
      object_resizing: true,
      setup: (editor) => {
        editor.ui.registry.addGroupToolbarButton('alignment', {
          icon: 'align-left',
          tooltip: 'Alignment',
          items: 'alignleft aligncenter alignright | alignjustify',
        });
        editor.ui.registry.addGroupToolbarButton('h', {
          icon: 'h5',
          tooltip: 'H',
          items: 'h1 h2 h3 h4 h5 h6',
        });
      },
    }"
  />
</template>
