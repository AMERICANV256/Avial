const contacto = (props) => {
  return `
      <head>
    <title>Gracias por Contactarnos!</title>
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
  <p>Gracias por ponerte en contacto con nosotros. En AMERICAN VIAL, valoramos tu interés en nuestra amplia gama de equipos de construcción y maquinaria vial. Un asesor de ventas se pondrá en contacto contigo rápidamente para discutir tus necesidades específicas y proporcionarte la mejor solución posible.</p>
  <p>Estamos comprometidos en ofrecer productos de alta calidad que cumplen con los estándares más exigentes del mercado. Nuestro objetivo es asegurar que encuentres la maquinaria adecuada para cada uno de tus proyectos, facilitando así tu trabajo y garantizando resultados excelentes.</p>
  <p>Para más detalles sobre nuestros productos y servicios, te invitamos a visitar nuestro sitio web y explorar todas las opciones disponibles. También puedes seguirnos en nuestras redes sociales para estar al tanto de nuestras promociones especiales y las últimas novedades del sector.</p>
  <p>¡Esperamos poder asistirte pronto!</p>
  <p><b>Equipo AMERICAN VIAL</b></p>
  <p><b>P.D.</b> No te pierdas nuestras novedades y promociones especiales. Síguenos en nuestras redes sociales para estar al tanto de todo lo que tenemos para ofrecerte!</p>
</body>
  
    </html>`;
};

module.exports = contacto;
