<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
</svelte:head>
<script>
	import { onMount } from "svelte"
	import { initializeApp, getApps, getApp } from 'firebase/app';
	import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
	import { firebaseConfig } from '$lib/firebaseConfig';
	import { browser } from '$app/env';
	import { Col, Container, Row , Table } from 'sveltestrap';

	const firebaseApp =
		browser && (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp());

	const db = browser && getFirestore();

	const colRef = browser && collection(db, 'keller');

	let todos = [];
	let currentFilter = "all";

	const unsubscribe =
		browser &&
		onSnapshot(colRef, (querySnapshot) => {
			let fbTodos = [];
			browser && querySnapshot.forEach((doc) => {
				let todo = { ...doc.data(), id: doc.id };
				fbTodos = [todo, ...fbTodos];
			});
			todos = fbTodos;
		});

	let task = '';

	const addTodo = () => {
		let todo = {
			task: task,
			isComplete: false,
			createdAt: new Date()
		};
		if (task != '') {
			todos = [...todos, todo];
		}
		task = '';
	};

	function render() {
    currentFilter = "all";
    if (window.location.hash === "#redwine") {
      currentFilter = "redwine";
    } else if (window.location.hash === "#completed") {
      currentFilter = "completed";
    }
  }


	//window.addEventListener("hashchange", render);

	$: filtered = currentFilter === 'all' ? todos : todos.filter((item) => item.Art === 'R')

</script>
<svelte:window on:hashchange={render}/>
<Container>
	<ul class="filters">
        <li>
          <a class={currentFilter === "all" ? "selected" : ""} href="#all">
            All
          </a>
        </li>
        <li>
          <a
            class={currentFilter === "active" ? "selected" : ""}
            href="#redwine"
          >
            Rotweine
          </a>
        </li>
      </ul>
</Container>

<Container>
  <Row>
	  <Col>
<Table size="sm" bordered striped hover responsive>
  <thead>
    <tr>
      <th>Art</th>
      <th>Flaschen gekauft</th>
      <th>Flaschen im Keller</th>
      <th>Jahrgang</th>
      <th>Land</th>
      <th>Region</th>
      <th>Erzeuger</th>
      <th>Name</th>
      <th>Traube</th>
    </tr>
  </thead>
  <tbody>
	  {#each filtered as item, index}
		<tr>
			<td>{item.Art}</td>
			<td>{item['Flaschen gekauft']}</td>
			<td>{item['Flaschen im Keller']}</td>
			<td>{item.Jahrgang}</td>
			<td>{item.Land}</td>
			<td>{item.Region}</td>
			<td>{item.Erzeuger}</td>
			<td>{item.Name}</td>
			<td>{item.Traube}</td>
		</tr>
	{:else}
		<p>Loading data ...</p>
	{/each}

  </tbody>
</Table>

</Col>
</Row>
</Container>
