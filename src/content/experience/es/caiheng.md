---
company: "Caiheng"
role: "Full Stack Engineer"
location: "Ambato, híbrido"
summary: "Dashboard para gerentes de producción de alimentos con datos de sistemas SCADA (React, ApexCharts, uPlot) y API en Flask sobre MongoDB y SQL Server; frontend capaz de mostrar millones de registros."
order: 3
start: 2024-06-01
end: 2024-10-01
story:
  title: "Datos de planta convertidos en decisiones de producción"
  summary: "Reportes y un centro de mando para fábricas de alimento balanceado: datos de PLC y SCADA convertidos en información para decidir durante la jornada, sin papeleo."
  industry: "Alimento balanceado"
  stack:
    - "React"
    - "ApexCharts"
    - "uPlot"
    - "Flask"
    - "MongoDB"
    - "Redis"
    - "Microsoft SQL Server"
    - "PLC Siemens"
  blocks:
    - id: "contexto"
      eyebrow: "01 · Contexto"
      title: "Máquinas que generaban datos que nadie usaba"
      visual: "machines"
      body: |
        Caiheng trabajaba con fábricas de alimento para animales. En cada planta, máquinas como peletizadoras, extrusoras, evaporadores y silos estaban controladas por PLC Siemens y monitoreadas con sistemas SCADA.

        Los datos existían, pero no llegaban en una forma útil a quienes debían decidir. El seguimiento de la producción dependía en gran parte del papeleo.
    - id: "el-verdadero-reto"
      eyebrow: "02 · El verdadero reto"
      title: "Entender cómo se produce el alimento"
      visual: "recipes"
      body: |
        No bastaba con desarrollar software. Para construir el dashboard tuve que entender la lógica de producción: cómo una receta se traduce en materiales como maíz, cebada o soya, y cómo se mide el rendimiento de cada uno.

        Ese fue el verdadero reto, junto con trabajar de cerca con personas de otras áreas: ingenieros en producción de alimentos e ingenieros en automatización.
    - id: "lo-que-construi"
      eyebrow: "03 · Lo que construí"
      title: "Un flujo de datos de la máquina a la pantalla"
      visual: "pipeline"
      body: |
        En la planta más grande donde Caiheng implementó el software, el recorrido era físico: las máquinas reportaban a un servidor de PLC Siemens, los datos se guardaban en tres bases de datos y un único computador de control los consumía.

        Construí el software que corría en ese computador: una API en Flask que unía Microsoft SQL Server, MongoDB, con el registro de todo lo que se producía, y Redis, con la información de los materiales utilizados; y un dashboard en React, con ApexCharts y uPlot, preparado para mostrar millones de registros.
    - id: "centro-de-mando"
      eyebrow: "04 · Centro de mando"
      title: "Lo producido y lo pendiente, durante la jornada"
      visual: "command"
      body: |
        El personal de producción trabajaba desde una sala de control con 6 pantallas alimentadas por ese único computador. Ahí, los encargados podían ver lo que ya habían producido y lo que les faltaba producir durante su jornada laboral.

        También veían el rendimiento de cada material con respecto a cada receta. Los reportes estaban dirigidos tanto al personal que produce los alimentos como a la gerencia.
    - id: "resultado"
      eyebrow: "05 · Resultado"
      title: "Un producto para varios clientes"
      visual: "tenants"
      body: |
        Los reportes reemplazaron el papeleo y dinamizaron la producción: las decisiones se podían tomar durante la jornada, con información actualizada.

        Caiheng tenía varios clientes que producían distintas recetas para pollos, cerdos, perros y caballos. El mismo dashboard le servía a cada empresa, con sus propias recetas.
---

### Arquitectura

- **Origen de datos:** PLC Siemens de cada máquina de planta (peletizadoras, extrusoras, evaporadores, silos), leídos a través de sistemas SCADA y un servidor de PLC.
- **Backend:** API en Flask (Python) que consolida los datos de producción y los expone para los reportes.
- **Persistencia:** tres bases de datos unificadas detrás de la API. MongoDB guarda el registro de lo producido, Redis la información de materiales (maíz, cebada y otros) y Microsoft SQL Server completa el modelo.
- **Frontend:** dashboard en React con ApexCharts y uPlot.
- **Despliegue en planta:** en la planta más grande, un único computador de control ejecutaba el software y alimentaba una sala de control con 6 pantallas.

### Decisiones

- **El dominio primero:** recetas, materiales y rendimientos se modelaron a partir de conversaciones con ingenieros en producción de alimentos y en automatización, antes de definir los reportes.
- **Un producto, varios clientes:** cada empresa usa el mismo dashboard con sus propias recetas, en lugar de mantener una versión por cliente.
- **Dos audiencias:** vistas operativas para el personal de planta durante la jornada y reportes para gerencia.

### Grandes volúmenes de datos

El frontend se construyó para mostrar millones de registros de producción. uPlot, una librería de gráficos ligera que dibuja en canvas, se usó junto a ApexCharts para la visualización.

### Stack

PLC Siemens · SCADA · Python · Flask · MongoDB · Redis · Microsoft SQL Server · React · ApexCharts · uPlot
