import { RouterView } from '@liuli-util/react-router'
import { h, menus } from '../../constants/routes'
import css from './LayoutView.module.css'

export function LayoutView() {
  return (
    <div className={css.LayoutView}>
      <nav>
        <ul className={css.menus}>
          {menus.map((item) => (
            <li key={item.path} onClick={() => h.push(item.path)}>
              {item.meta.title}
            </li>
          ))}
        </ul>
      </nav>
      <div className={css.continer}>
        <RouterView></RouterView>
      </div>
    </div>
  )
}
