function updateClock() {
    var now = new Date();
  
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var milliseconds = now.getMilliseconds();
    var month = now.toLocaleString('default', { month: 'long' }); // Get month name
  
    var time = hours + ':' + addZeroPadding(minutes) + ':' + addZeroPadding(seconds) + '.' + addZeroPaddingMilliseconds(milliseconds);
    var date = month + ' ' + now.getDate() + ', ' + now.getFullYear();
  
    document.getElementById('date').innerHTML = date;
    document.getElementById('time').innerHTML = time;
  
    setTimeout(updateClock, 1); // Update every millisecond
  }
  
  // Function to add zero padding to numbers less than 10
  function addZeroPadding(num) {
    return (num < 10 ? '0' : '') + num;
  }
  
  // Function to add zero padding to milliseconds less than 100
  function addZeroPaddingMilliseconds(num) {
    return (num < 100 ? '0' : '') + (num < 10 ? '0' : '') + num;
  }
  
  // Start the clock
  updateClock();