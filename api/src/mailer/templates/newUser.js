const newUser = (props) => {
  return `
    <head>
  <title>Bienvenido a AMERICAN VIAL</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.5;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      text-align: center;
    }

    img {
      width: 100%;
      height: auto;
      max-width: none; 
    }

    h1, h2, h3 {
      font-weight: bold;
    }

    h3 {
      font-size: 2.5em;
      color: #555;
      margin-bottom: 0.5em;
    }

    p {
      margin-bottom: 1.5em;
      text-align: justify;
      margin-left: 10%;
      margin-right: 10%;
    }

    a {
      color: #D4AC0D;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      p {
        margin-left: 5%;
        margin-right: 5%;
      }
      
      h3 {
        font-size: 2em;
      }
    }

    @media (max-width: 480px) {
      p {
        margin-left: 2%;
        margin-right: 2%;
      }
      
      h3 {
        font-size: 1.5em;
      }
    }
  </style>
</head>

 <body>
  <img src="https://res.cloudinary.com/dmfzplfra/image/upload/v1720320478/Images/hyasokhgis5icxiu6q0g.jpg"/>

  <p><b>Hola ${props.email},</b></p>
  <p>¡Bienvenido a AMERICAN VIAL! Nos complace darte la bienvenida a nuestra comunidad de profesionales de la construcción y maquinaria vial. Sabemos que encontrar equipos y soluciones confiables para tus proyectos puede ser un desafío, especialmente cuando buscas calidad y durabilidad. Es por eso que creamos AMERICAN VIAL, para ofrecerte una amplia selección de máquinas viales de primera categoría.</p>
  <p>¿Alguna vez te has sentido frustrado por no encontrar la maquinaria adecuada para tus necesidades? Estamos aquí para resolver ese problema. Explora nuestra colección y descubrirás una variedad de equipos que se adaptan a tus exigencias y te ayudarán a construir el futuro con confianza.</p>
  <p>Nos aseguramos de que nuestras máquinas viales cumplan con los más altos estándares de calidad, para que puedas sentirte seguro y eficiente en cada proyecto. Además, si buscas algo específico, nuestro equipo está aquí para ayudarte a encontrar la solución perfecta para ti.</p>
  <p>Queremos que disfrutes de una experiencia sin complicaciones al adquirir tu maquinaria, por eso hemos diseñado AMERICAN VIAL para ser lo más accesible y conveniente posible. Constantemente estamos añadiendo nuevos equipos y tecnologías para mantenerte actualizado con las últimas innovaciones del sector.</p>
  <p>¿Estás listo para explorar nuestra colección? ¡Visita nuestro sitio web <a href="https://americanvial.com/">Ingresar</a> y encuentra la maquinaria vial perfecta para tus proyectos hoy mismo!</p>
  <p>Nos estamos viendo!,</p>
  <p><b>Equipo AMERICAN VIAL</b></p>
  <p><b>P.D.</b> No te pierdas nuestras novedades y promociones especiales. Síguenos en nuestras redes sociales para estar al tanto de todo lo que tenemos para ofrecerte!</p>
</body>

  </html>`;
};

module.exports = newUser;
