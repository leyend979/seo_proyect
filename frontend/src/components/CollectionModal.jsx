import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const toolbarOptions = [
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
];

export default function CollectionModal({
  visible,
  onClose,
  onSave,
  initialData,
}) {
  const [titulo, setTitulo] = useState("");
  const [secciones, setSecciones] = useState([]);

  // Limpia saltos extra y envoltorios innecesarios
  const limpiarHTML = (html) => {
    return html
      .replace(/<p><br><\/p>/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();
  };

  // Inicializa modal
  useEffect(() => {
    if (!visible) return;

    if (initialData) {
      let parsed = initialData.contenido || [];

      // Si viene como string JSON → parsear
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
        } catch (err) {
          parsed = [];
        }
      }

      setTitulo(initialData.titulo || "");

      // Asignar un ref por sección (CRÍTICO)
      setSecciones(
        parsed.map((sec) => ({
          ...sec,
          contenido: limpiarHTML(sec.contenido || ""),
          quillRef: React.createRef(),
        }))
      );
    } else {
      // Nuevo proyecto
      setTitulo("");
      setSecciones([
        {
          tituloSecundario: "",
          contenido: "",
          quillRef: React.createRef(),
        },
      ]);
    }
  }, [visible, initialData]);

  // Manejar cambios en secciones
  const handleChangeSeccion = (index, campo, valor) => {
    const copia = [...secciones];
    copia[index][campo] = valor;
    setSecciones(copia);
  };

  // Agregar sección nueva
  const agregarSeccion = () => {
    setSecciones([
      ...secciones,
      {
        tituloSecundario: "",
        contenido: "",
        quillRef: React.createRef(),
      },
    ]);
  };

  // Eliminar sección
  const eliminarSeccion = (index) => {
    const copia = [...secciones];
    copia.splice(index, 1);
    setSecciones(copia);
  };

  // Insertar imagen en el editor correcto
  const insertarImagenEnQuill = (index, url) => {
    const editorComponent = secciones[index]?.quillRef?.current;
    if (!editorComponent) {
      alert("El editor aún no está listo");
      return;
    }

    const quill = editorComponent.getEditor();
    const range = quill.getSelection(true);

    quill.insertEmbed(range.index, "image", url);
    quill.setSelection(range.index + 1);
  };

  // Guardar colección
  const handleGuardar = () => {
    onSave({
      titulo,
      contenido: secciones.map((s) => ({
        tituloSecundario: s.tituloSecundario,
        contenido: limpiarHTML(s.contenido),
      })),
    });

    onClose();
  };

  if (!visible) return null;

  return (
    <div className="modalOverlay">
      <div className="modal">
        <h2>{initialData ? "Editar colección" : "Nueva colección"}</h2>

        {/* Título */}
        <label>Título principal</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título del proyecto"
        />

        {/* SECCIONES */}
        <h3 style={{ marginTop: "20px" }}>Secciones</h3>

        {secciones.map((sec, i) => (
          <div key={i} className="seccionBox">
            <label>Título secundario</label>
            <input
              type="text"
              value={sec.tituloSecundario}
              onChange={(e) =>
                handleChangeSeccion(i, "tituloSecundario", e.target.value)
              }
              placeholder="Subtítulo"
            />

            <label>Contenido</label>
            <ReactQuill
              ref={sec.quillRef}
              value={sec.contenido}
              onChange={(val) => handleChangeSeccion(i, "contenido", val)}
              modules={{ toolbar: toolbarOptions }}
            />

            {/* Botón insertar imagen */}
            <button
              className="insertImageBtn"
              onClick={() => {
                const url = prompt("Pega la URL de la imagen:");
                if (url) insertarImagenEnQuill(i, url);
              }}
            >
              Insertar imagen
            </button>

            <button
              className="deleteBtn"
              onClick={() => eliminarSeccion(i)}
              disabled={secciones.length === 1}
            >
              Eliminar sección
            </button>
          </div>
        ))}

        <button className="addBtn" onClick={agregarSeccion}>
          + Agregar sección
        </button>

        {/* BOTONERA */}
        <div className="modalButtons">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleGuardar} className="saveBtn">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

