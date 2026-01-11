import ModalDetail from "@/components/Modal/ModalDetail.vue";
import Pagination from "@/components/Pagination/index.vue";
import RichEditor from "@/components/Base/RichEditor.vue";
import RichEditorTiny from "@/components/Base/RichEditorTiny.vue";
import AddReload from "@/components/Base/AddReload.vue";
import FormMeta from "@/components/Base/FormMeta.vue";
import ContentBlog from "@/components/Base/ContentBlog.vue";
import ButtonSave from "@/components/Base/ButtonSave.vue";
import ButtonSearch from "@/components/Base/ButtonSearch.vue";
import NaiveUpload from "@/components/Base/NaiveUpload.vue";
import NaiveSelect from "@/components/Base/NaiveSelect.vue";
import NaiveSelectTree from "@/components/Base/NaiveSelectTree.vue";
import NaiveInput from "@/components/Base/NaiveInput.vue";
import NaiveDatePicker from "@/components/Base/NaiveDatePicker.vue";
import NaiveInputNumber from "@/components/Base/NaiveInputNumber.vue";
import BaseAddReload from "@/components/Base/AddReload.vue";
import BaseButtonBack from "@/components/Base/ButtonBack.vue";
import UpdateAddress from "@/components/Base/UpdateAddress.vue";

import IconX from "@/components/icon/X.vue";
import IconPencil from "@/components/icon/Pencil.vue";
import IconBin from "@/components/icon/Bin.vue";
import IconStart from "@/components/icon/Start.vue";
import IconPause from "@/components/icon/Pause.vue";
import IconDeleteModal from "@/components/icon/DeleteModal.vue";

export function setupGlobalComponents(app) {
  const components = {
    ModalDetail,
    Pagination,
    RichEditor,
    RichEditorTiny,
    AddReload,
    FormMeta,
    ContentBlog,
    ButtonSave,
    ButtonSearch,
    NaiveSelect,
    NaiveSelectTree,
    NaiveInput,
    NaiveUpload,
    NaiveDatePicker,
    NaiveInputNumber,
    BaseAddReload,
    BaseButtonBack,
    UpdateAddress,

    IconX,
    IconPencil,
    IconBin,
    IconStart,
    IconPause,
    IconDeleteModal,
  };

  Object.entries(components).forEach(([name, comp]) => {
    try {
      if (!app.component(name) && comp) {
        app.component(name, comp);
      }
    } catch (e) {
      if (comp) app.component(name, comp);
    }
  });
}
