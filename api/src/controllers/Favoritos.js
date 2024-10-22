const { Productos } = require("../db.js");
const { Favoritos } = require("../db.js");

const getFavoritosAsc = async (req, res) => {
  try {
    const { idUsuario } = req.params; // Obtener idUsuario de los parámetros de la ruta

    if (!idUsuario) {
      return res
        .status(400)
        .json({ error: "El campo 'idUsuario' es requerido." });
    }

    const favoritos = await Favoritos.findAll({
      where: {
        idUsuario,
      },
      include: [
        {
          model: Productos,
          attributes: [
            "id",
            "familia",
            "marca",
            "modelo",
            "imagen",
            "imagen1",
            "imagen2",
            "imagen3",
            "imagen4",
            "imagen5",
            "imagen6",
            "precio",
            "precioUSD",
            "fichaPDF",
            "codigo",
            "division",
            "potencia",
            "cantidadTotal",
            "motor",
            "capacidadDeCarga",
            "capacidadDeBalde",
            "detalles",
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    return res.status(200).json(favoritos);
  } catch (error) {
    console.error("Error al obtener los favoritos:", error);
    return res
      .status(500)
      .json({ error: `Error al obtener los favoritos: ${error.message}` });
  }
};

const createFavorito = async (req, res) => {
  try {
    const { idProducto, idUsuario } = req.body;

    if (!idProducto || !idUsuario) {
      return res
        .status(400)
        .json({ error: "El idProducto y el idUsuario son requeridos." });
    }

    const newFavorito = await Favoritos.create({
      idProducto,
      idUsuario,
    });

    return res.status(201).json(newFavorito);
  } catch (error) {
    console.error("Error al crear el favorito:", error);
    return res
      .status(500)
      .json({ error: `Error al crear el favorito: ${error.message}` });
  }
};

const deleteFavorito = async (req, res) => {
  try {
    const { id } = req.body;

    const result = await Favoritos.destroy({
      where: { id },
    });

    if (result === 0) {
      return res.status(404).json({ error: "Favorito no encontrado." });
    }

    return res
      .status(200)
      .json({ message: "Favorito eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar el favorito:", error);
    return res
      .status(500)
      .json({ error: `Error al eliminar el favorito: ${error.message}` });
  }
};

module.exports = {
  deleteFavorito,
  getFavoritosAsc,
  createFavorito,
};
