export const formatStatus = (status) => {
    if (status === 'OK') return 'green';
    if (status === 'Working with issues') return 'orange';
    return 'red';
  };
  
  export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  