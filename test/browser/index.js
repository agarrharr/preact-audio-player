import { h, render, rerender } from 'preact';
import SigninWidget from 'components/signin';

/*global sinon,expect*/

describe('App', () => {
	let scratch;

	before( () => {
		scratch = document.createElement('div');
		(document.body || document.documentElement).appendChild(scratch);
	});

	beforeEach( () => {
		scratch.innerHTML = '';
	});

	after( () => {
		scratch.parentNode.removeChild(scratch);
		scratch = null;
	});

	describe('Siginin widget', () => {
		it('Should render Signin Widget', () => {
			render(<SigninWidget />, scratch);
			rerender();

			expect(scratch.innerHTML).to.contain(`<h3>External Signin Widget</h3>`);
		});
	});

});
