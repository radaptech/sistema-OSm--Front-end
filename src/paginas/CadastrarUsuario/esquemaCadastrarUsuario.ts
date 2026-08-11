import { z } from 'zod'
import { perfisLogin } from '../../tipos/autenticacao'
import { areasTecnico } from '../../tipos/tecnico'

export const esquemaCadastrarUsuario = z
  .object({
    nome: z.string().min(1, 'Informe o nome.').max(100),
    telefone: z.string().max(20).optional(),
    email: z.email('Informe um e-mail válido.'),
    senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
    perfil: z.enum(perfisLogin, 'Selecione o perfil.'),
    lojasIds: z.array(z.number().int().positive()),
    setoresIds: z.array(z.number().int().positive()),
    acessoTotalSetores: z.boolean(),
    area: z.enum(areasTecnico).optional(),
  })
  .superRefine((dados, ctx) => {
    if (dados.perfil === 'administrador') {
      return
    }

    if (dados.lojasIds.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Selecione ao menos uma loja.',
        path: ['lojasIds'],
      })
    }

    if (dados.perfil === 'solicitante') {
      if (dados.lojasIds.length > 1) {
        ctx.addIssue({
          code: 'custom',
          message: 'Solicitante deve ter apenas uma loja vinculada.',
          path: ['lojasIds'],
        })
      }

      if (dados.setoresIds.length !== 1) {
        ctx.addIssue({
          code: 'custom',
          message: 'Selecione o setor do solicitante.',
          path: ['setoresIds'],
        })
      }
    }

    if (
      dados.perfil === 'gestor' &&
      !dados.acessoTotalSetores &&
      dados.setoresIds.length === 0
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Selecione ao menos um setor ou marque acesso total.',
        path: ['setoresIds'],
      })
    }

    if (dados.perfil === 'tecnico' && !dados.area) {
      ctx.addIssue({
        code: 'custom',
        message: 'Selecione a área de atuação.',
        path: ['area'],
      })
    }
  })

export type DadosCadastrarUsuario = z.infer<typeof esquemaCadastrarUsuario>
