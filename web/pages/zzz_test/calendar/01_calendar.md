
<a name="topage"></a>

# 01_calendar


### 🛠️ Tech Stack
- **HTML**: Structure
- **CSS**: Styling and layout
- **JavaScript**: Logic and date handling
- **JSON**: Store image and event data

---

### 📁 Sample Folder Structure
```
/calendar-project
│
├── index.html
├── styles.css
├── script.js
└── events.json
```

---

### 🗂️ `events.json` (Data Example)
```json
{
  "2025-06-16": {
    "image": "birthday.jpg",
    "icon": "🎂",
    "title": "Alice's Birthday"
  },
  "2025-06-20": {
    "image": "vacation.jpg",
    "icon": "🏖️",
    "title": "Vacation Starts"
  },
  "default": {
    "image": "default.jpg"
  }
}
```

---

### 🧱 `index.html`
```html
<div class="calendar-container">
  <img id="banner" src="default.jpg" alt="Banner">
  <div id="calendar"></div>
</div>
```

---

### 🎨 `styles.css`
```css
.calendar-container {
  text-align: center;
}
#banner {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
.date-cell {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  margin: 5px;
  vertical-align: top;
  position: relative;
}
.date-cell span {
  position: absolute;
  bottom: 5px;
  right: 5px;
}
```

---

### 🧠 `script.js`
```javascript
async function loadEvents() {
  const res = await fetch('events.json');
  const data = await res.json();
  const today = new Date().toISOString().split('T')[0];
  const banner = document.getElementById('banner');
  banner.src = data[today]?.image || data['default'].image;
  generateCalendar(data);
}

function generateCalendar(events) {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';
  const date = new Date();
  date.setDate(1);
  const year = date.getFullYear();
  const month = date.getMonth();

  for (let day = 1; day <= 31; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const cell = document.createElement('div');
    cell.className = 'date-cell';
    cell.textContent = day;
    if (events[dateStr]) {
      const icon = document.createElement('span');
      icon.textContent = events[dateStr].icon;
      cell.appendChild(icon);
    }
    calendar.appendChild(cell);
  }
}

loadEvents();
```

  
-----

<p align="right">(<a href="#topage">back to top</a>)</p>
<br/>
<br/>
