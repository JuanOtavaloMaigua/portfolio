---
company: "Caiheng"
role: "Full Stack Engineer"
location: "Ambato, hybrid"
summary: "Dashboard for food production managers fed by SCADA data (React, ApexCharts, uPlot) and a Flask API over MongoDB and SQL Server; a frontend able to render millions of records."
order: 3
start: 2024-06-01
end: 2024-10-01
story:
  title: "Turning plant data into production decisions"
  summary: "Reports and a control center for animal feed plants: PLC and SCADA data turned into information for decisions during the shift, without paperwork."
  industry: "Animal feed"
  stack:
    - "React"
    - "ApexCharts"
    - "uPlot"
    - "Flask"
    - "MongoDB"
    - "Redis"
    - "Microsoft SQL Server"
    - "Siemens PLC"
  blocks:
    - id: "context"
      eyebrow: "01 · Context"
      title: "Machines producing data nobody used"
      visual: "machines"
      body: |
        Caiheng worked with animal feed plants. In each plant, machines such as pellet mills, extruders, evaporators and silos were controlled by Siemens PLCs and monitored through SCADA systems.

        The data existed, but it did not reach decision makers in a useful form. Tracking production relied heavily on paperwork.
    - id: "the-real-challenge"
      eyebrow: "02 · The real challenge"
      title: "Understanding how feed is made"
      visual: "recipes"
      body: |
        Building software was not enough. To build the dashboard I had to understand the production logic: how a recipe translates into materials such as corn, barley or soy, and how the yield of each one is measured.

        That was the real challenge, along with working closely with people from other fields: food production engineers and automation engineers.
    - id: "what-i-built"
      eyebrow: "03 · What I built"
      title: "A data flow from machine to screen"
      visual: "pipeline"
      body: |
        At the largest plant where Caiheng deployed the software, the path was physical: machines reported to a Siemens PLC server, the data was stored in three databases, and a single control computer consumed it.

        I built the software that ran on that computer: a Flask API that brought together Microsoft SQL Server, MongoDB, holding the record of everything produced, and Redis, holding information about the materials used; and a React dashboard with ApexCharts and uPlot, designed to display millions of records.
    - id: "control-center"
      eyebrow: "04 · Control center"
      title: "Produced and pending, during the shift"
      visual: "command"
      body: |
        Production staff worked from a control room with 6 screens, all driven by that single computer. There, supervisors could see what they had already produced and what was still pending during their shift.

        They could also see the yield of each material against each recipe. The reports served both the staff making the feed and management.
    - id: "outcome"
      eyebrow: "05 · Outcome"
      title: "One product for several clients"
      visual: "tenants"
      body: |
        The reports replaced paperwork and made production more agile: decisions could be made during the shift, with up-to-date information.

        Caiheng had several clients producing different recipes for poultry, pigs, dogs and horses. The same dashboard served each company, with its own recipes.
---

### Architecture

- **Data source:** Siemens PLCs on each plant machine (pellet mills, extruders, evaporators, silos), read through SCADA systems and a PLC server.
- **Backend:** Flask (Python) API that consolidates production data and exposes it to the reports.
- **Persistence:** three databases unified behind the API. MongoDB stores the production record, Redis the material information (corn, barley and others), and Microsoft SQL Server completes the model.
- **Frontend:** React dashboard with ApexCharts and uPlot.
- **On-site deployment:** at the largest plant, a single control computer ran the software and drove a control room with 6 screens.

### Decisions

- **Domain first:** recipes, materials and yields were modeled from conversations with food production and automation engineers, before defining the reports.
- **One product, many clients:** every company uses the same dashboard with its own recipes, instead of maintaining one version per client.
- **Two audiences:** operational views for plant staff during the shift, and reports for management.

### Large datasets

The frontend was built to display millions of production records. uPlot, a lightweight canvas-based charting library, was used alongside ApexCharts for visualization.

### Stack

Siemens PLC · SCADA · Python · Flask · MongoDB · Redis · Microsoft SQL Server · React · ApexCharts · uPlot
