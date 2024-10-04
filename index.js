class SearchableSelect extends HTMLElement {

    constructor() {
        super()
        this.start()
        this.render()
        this.setEvents()
    }

    start() {
        this.$search = this.querySelector('input') ?? document.createElement('INPUT')
        this.$results = document.createElement('DIV')
        this.$options = this.querySelectorAll('option')
        this.$container = document.createElement('DIV')
        this.options = Array.from(this.$options).map(n => ({ v: n.value, t: n.textContent }))
    }

    render() {
        this.$results.classList.add('results')
        this.$container.classList.add("container")

        this.$container.prepend(this.$results)
        this.$container.prepend(this.$search)
        this.prepend(this.$container);

        this.renderResults(this.options)

        this.$results.setAttribute('hidden', '');
    }

    setEvents() {
        const handleSelect = (event) => {
            const $options = Array.from(this.$options)
            for (const $option of $options) {
                $option.removeAttribute('selected')
                if ($option.value === event.target.dataset.value) {
                    $option.setAttribute('selected', '')
                    this.$search.value = $option.textContent
                }
            }
            this.$results.hidden = true
        }

        this.$search.addEventListener('input', (event) => {
            const value = event.currentTarget.value;
            const options = this.options.filter(o => o.t.includes(value))
            this.renderResults(options)
        })

        this.$search.addEventListener('focus', () => {
            this.$results.hidden = false
            this.$results.addEventListener('click', handleSelect, { once: true })
        })
    }

    renderResults(options) {
        const new_options = []
        for (const option of options) {
            const $result = document.createElement('DIV')
            $result.role = "button"
            $result.classList.add("result")
            $result.dataset.value = option.v
            $result.textContent = option.t
            new_options.push($result)
        }
        this.$results.replaceChildren(...new_options)
    }
}

window.customElements.define('searchable-select', SearchableSelect)