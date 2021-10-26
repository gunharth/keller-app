<script>
	import { initializeApp, getApps, getApp } from 'firebase/app';
	import { getDatabase, ref as fireRef, onValue } from 'firebase/database';
	import { firebaseConfig } from '$lib/firebaseConfig';
	import { browser } from '$app/env';

	const firebaseApp =
		browser && (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp());

	const db = browser && getDatabase(firebaseApp);

	//const colRef = browser && collection(db, 'todos');

	let todos = [];

	const reload =
		browser &&
		onValue(fireRef(db, 'wasisimkella'), (snapshot) => {
			console.log(snapshot.val());
		});
	// const unsubscribe =
	// 	browser &&
	// 	onSnapshot(colRef, (querySnapshot) => {
	// 		let fbTodos = [];
	// 		querySnapshot.forEach((doc) => {
	// 			let todo = { ...doc.data(), id: doc.id };
	// 			fbTodos = [todo, ...fbTodos];
	// 		});
	// 		todos = fbTodos;
	// 	});

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
	const markTodoAsComplete = (index) => {
		todos[index].isComplete = !todos[index].isComplete;
	};
	const deleteTodo = (index) => {
		let deleteItem = todos[index];
		todos = todos.filter((item) => item != deleteItem);
	};

	const keyIsPressed = (e) => {
		if (e.key === 'Enter') {
			addTodo();
		}
	};
</script>

<input type="text" placeholder="Add a task" bind:value={task} />
<button on:click={addTodo}>Add</button>

<ol>
	{#each todos as item, index}
		<li class:complete={item.isComplete}>
			<span>
				{item.task}
			</span>
			<span>
				<button on:click={() => markTodoAsComplete(index)}>done</button>
				<button on:click={() => deleteTodo(index)}>delete</button>
			</span>
		</li>
	{:else}
		<p>Create your first todo</p>
	{/each}
</ol>

<svelte:window on:keydown={keyIsPressed} />

<style>
	.complete {
		text-decoration: line-through;
	}
</style>
