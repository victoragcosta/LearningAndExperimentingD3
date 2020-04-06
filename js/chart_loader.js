// Auxiliary functions
let formatter = d3.format(">02~");

function generateRandomData(min = 0, max = 20, size = null) {
  let arr = [];
  let newNum = () => min + Math.floor(Math.random() * (max - min));
  if (!size) size = 5 + Math.random() * 15;
  for (let i = 0; i < size; i++) {
    let num = newNum();
    while (arr.map((e) => e.value).includes(num)) {
      num = newNum();
    }
    arr.push({ value: num, color: "black" });
  }
  return arr;
}

function delay(ms) {
  return new Promise((resolve) => setInterval(resolve, ms));
}

async function bubbleSorting(
  arr,
  chart,
  selectedColor = "red",
  baseColor = "black",
  doneColor = "green"
) {
  // Copy the input array into a new array
  let items = arr.slice();

  // Update the chart with initial state and wait for the animation
  chart.data = items;
  await delay(800);

  // Bubblesort simple algorithm
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length - 1 - i; j++) {
      // Show which elements the algorithm is analyzing
      items[j].color = selectedColor;
      items[j + 1].color = selectedColor;
      chart.data = items;
      await delay(800);

      // If out of order, change order
      if (items[j].value > items[j + 1].value) {
        let t = items[j];
        items[j] = items[j + 1];
        items[j + 1] = t;
        // Show change of order
        chart.data = items;
        await delay(800);
      }

      // Change back to original color
      items[j].color = baseColor;
      items[j + 1].color = baseColor;
      chart.data = items;
      await delay(800);
    }
  }

  // Array is now in order, color it green
  chart.data = items.map((e) => {
    return { value: e.value, color: doneColor };
  });
}

async function showBubbleSort(
  playSelector,
  environment,
  startArr,
  selectedColor = "red",
  baseColor = "black",
  doneColor = "green"
) {
  // Guarantees that it is not running
  if (!environment.blocked) {
    // Disables button for visual information
    d3.select(playSelector).node().disabled = true;
    // Blocks running
    environment.blocked = true;

    // Waits for the completion of the sort
    await bubbleSorting(
      startArr,
      environment.chart,
      selectedColor,
      baseColor,
      doneColor
    );

    // Enables running again
    environment.blocked = false;
    // Allows button clicking and show that it can run again
    d3.select(playSelector).node().disabled = false;
  }
}
// /Auxiliary functions

// Random numbers demonstration
let randomNumbers = new ArrayDisplay("#random-numbers-display");
randomNumbers.data = generateRandomData();
setInterval(() => {
  randomNumbers.data = generateRandomData();
}, 2500);
// Random numbers demonstration

// Bubble Sort demonstration
let bubbleSort = new ArrayDisplay("#bubble-sort-display");
bubbleSort.data = d3.range(1, 16).map((e) => {
  return { value: e, color: "black" };
});
let bubbleSortEnvironment = {
  chart: bubbleSort,
  blocked: false,
};

if ($("#bubble-sort-play")[0]) {
  $("#bubble-sort-play").on("click", function () {
    showBubbleSort(
      "#bubble-sort-play",
      bubbleSortEnvironment,
      d3.shuffle(bubbleSort.data)
    );
  });
}

if ($("#bubble-sort-amount")[0]) {
  $("#bubble-sort-amount").on("change", function () {
    let quantity = +$(this).prop("value");
    bubbleSort.data = d3.range(1, quantity + 1).map((e) => {
      return { value: e, color: "black" };
    });
  });
}
// /Bubble Sort demonstration

// Bubble Sort 2 demonstration
let bubbleSort2 = new BarDisplay("#bubble-sort-2-display");
bubbleSort2.data = d3.range(1, 16).map((e) => {
  return { value: e, color: null };
});
let bubbleSort2Environment = {
  chart: bubbleSort2,
  blocked: false,
};
if ($("#bubble-sort-2-play")[0]) {
  $("#bubble-sort-2-play").on("click", function () {
    showBubbleSort(
      "#bubble-sort-2-play",
      bubbleSort2Environment,
      d3.shuffle(bubbleSort2.data),
      "red",
      null,
      null
    );
  });
}
if ($("#bubble-sort-2-amount")[0]) {
  $("#bubble-sort-2-amount").on("change", function () {
    let quantity = +$(this).prop("value");
    bubbleSort2.data = d3.range(1, quantity + 1).map((e) => {
      return { value: e, color: null };
    });
  });
}
// /Bubble Sort 2 demonstration