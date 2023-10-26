import { ref } from 'vue';

interface objData {
  id: number
}



export function usePermissionSelection(arrayPrincipal = [], keyIdComparation = "id", keyArray = "permissions") {
  const arrayFather = ref<Array<object>>(arrayPrincipal);
  const selectedFather = ref<Array<number>>([]);
  const selectedElements = ref<Array<number>>([]);



  function selectAllPermissions(cardId: number) {
    const dataIndex = arrayFather.value.findIndex((ele) => ele[keyIdComparation] == cardId);
    console.log("dataIndex", dataIndex);
    if (dataIndex !== -1) {
      const data = arrayFather.value[dataIndex];

      data[keyArray].forEach((element: objData) => {
        if (!selectedElements.value.includes(element[keyIdComparation])) {
          selectedElements.value.push(element.id);
        }
      });
    }
  }

  function handleCardCheckboxChange(cardId: number) {
    if (selectedFather.value.includes(cardId)) {
      selectAllPermissions(cardId);
    }
  }

  function handlePermissionCheckboxChange(cardId: number, event: Array<number>) {
    selectedElements.value = [...event]
    const dataIndex = arrayFather.value.findIndex((ele) => ele[keyIdComparation] === cardId);
    if (dataIndex !== -1) {
      const data = arrayFather.value[dataIndex];

      const allElementsSelected = data[keyArray].every((element: objData) =>
        selectedElements.value.includes(element.id)
      );

      if (!allElementsSelected) {
        selectedFather.value = selectedFather.value.filter((id) => id !== cardId);
      } else {
        selectedFather.value.push(cardId)
      }
    }
  }

  return {
    arrayFather,
    selectedFather,
    selectedElements,
    handleCardCheckboxChange,
    handlePermissionCheckboxChange,
  };
}
